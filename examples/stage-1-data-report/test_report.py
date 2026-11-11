"""Independent expectations, disposable files and synthetic loopback requests."""
import contextlib
import io
import json
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from unittest.mock import patch
from report_core import DataError, MAX_BYTES, build_report, parse_catalog, parse_orders
import report_cli

CATALOG = b'{"version":1,"prices_cents":{"PEN":125,"BOOK":450}}'
ORDERS = b'sku,quantity\nPEN,2\nBOOK,1\nPEN,3\n'
EXPECTED = {"version": 1, "row_count": 3, "items": [
    {"sku": "BOOK", "quantity": 1, "unit_cents": 450, "subtotal_cents": 450},
    {"sku": "PEN", "quantity": 5, "unit_cents": 125, "subtotal_cents": 625}],
    "total_cents": 1075}


@contextlib.contextmanager
def fixture(status=200, body=CATALOG, media="application/json", length=None, transfer=None):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(status)
            self.send_header("Content-Type", media)
            self.send_header("Content-Length", str(len(body)) if length is None else length)
            if transfer is not None:
                self.send_header("Transfer-Encoding", transfer)
            self.end_headers()
            self.wfile.write(body)
        def log_message(self, *args):
            pass
    server = HTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}/catalog"
    finally:
        server.shutdown()
        thread.join(timeout=3)
        server.server_close()


class ReportTests(unittest.TestCase):
    def test_worked_arithmetic_and_order_independence(self):
        self.assertEqual(build_report(ORDERS, CATALOG), EXPECTED)
        self.assertEqual(build_report(b'sku,quantity\nPEN,3\nPEN,2\nBOOK,1', CATALOG), EXPECTED)
        self.assertEqual(build_report(b'sku,quantity\r\n"PEN","2"\r\n', CATALOG)["total_cents"], 250)

    def test_missing_and_unexpected_csv_values(self):
        for row in [b'', b'PEN,', b',1', b'PEN,0', b'PEN,-1', b'PEN,01', b'PEN,+1',
                    b'PEN,1.0', b'PEN, 1', b'PEN,10000', b'PEN,1,extra', b'"PEN,1',
                    'PEN,١'.encode(), b'PEN,1\n\n']:
            with self.subTest(row=row), self.assertRaises(DataError):
                build_report(b'sku,quantity\n' + row, CATALOG)
        for header in [b'', b'quantity,sku\n1,PEN', b'sku,quantity,extra\nPEN,1,x', b'\xef\xbb\xbfsku,quantity\nPEN,1']:
            with self.subTest(header=header), self.assertRaises(DataError):
                build_report(header, CATALOG)

    def test_late_failure_never_returns_partial_report(self):
        with self.assertRaisesRegex(DataError, "line 3: unknown sku LOST"):
            build_report(b'sku,quantity\nPEN,2\nLOST,1', CATALOG)
        with self.assertRaisesRegex(DataError, "line 3: quantity"):
            build_report(b'sku,quantity\nPEN,2\nBOOK,', CATALOG)

    def test_strict_catalog_schema(self):
        for raw in [b'', b'{', b'\xff', b'[]', b'{"version":true,"prices_cents":{"PEN":1}}',
                    b'{"version":1,"version":1,"prices_cents":{"PEN":1}}',
                    b'{"version":1,"prices_cents":{"PEN":1,"PEN":2}}',
                    b'{"version":1,"prices_cents":{"PEN":NaN}}', b'['*1000+b']'*1000]:
            with self.subTest(raw=raw[:40]), self.assertRaises(DataError):
                parse_catalog(raw)
        for prices in [{}, {"PEN": True}, {"PEN": 0}, {"PEN": -1}, {"PEN": 1.2},
                       {"PEN": "125"}, {"PEN": 1000001}, {"bad": 1}, {"PEN": None}]:
            with self.subTest(prices=prices), self.assertRaises(DataError):
                parse_catalog(json.dumps({"version": 1, "prices_cents": prices}).encode())
        self.assertEqual(parse_catalog(b'{"version":1,"prices_cents":{"PEN":1000000}}'), {"PEN": 1000000})

    def test_byte_row_and_product_limits(self):
        padded = CATALOG + b' ' * (MAX_BYTES - len(CATALOG))
        self.assertEqual(parse_catalog(padded)["PEN"], 125)
        with self.assertRaises(DataError):
            parse_catalog(padded + b' ')
        self.assertEqual(len(parse_orders(b'sku,quantity\n' + b'PEN,9999\n'*1000)), 1000)
        with self.assertRaises(DataError):
            parse_orders(b'sku,quantity\n' + b'PEN,1\n'*1001)
        with self.assertRaises(DataError):
            parse_orders(b'x'*(MAX_BYTES+1))
        with self.assertRaises(DataError):
            parse_orders(b'sku,quantity\nPEN,\xff')
        prices = {f"P{i}": 1 for i in range(100)}
        self.assertEqual(len(parse_catalog(json.dumps({"version":1,"prices_cents":prices}).encode())), 100)
        prices["EXTRA"] = 1
        with self.assertRaises(DataError):
            parse_catalog(json.dumps({"version":1,"prices_cents":prices}).encode())

    def test_real_cli_roundtrip_and_input_preservation(self):
        with tempfile.TemporaryDirectory() as folder:
            orders, catalog = Path(folder)/"orders.csv", Path(folder)/"catalog.json"
            orders.write_bytes(ORDERS)
            catalog.write_bytes(CATALOG)
            def call(*args):
                return subprocess.run([sys.executable, str(Path(report_cli.__file__)), *args],
                                      capture_output=True, text=True, timeout=5)
            result = call("--orders", str(orders), "--catalog", str(catalog))
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout), EXPECTED)
            self.assertEqual(result.stderr, "")
            orders.write_bytes(b'sku,quantity\nPEN,2\nBOOK,')
            for args in [("--orders",str(orders),"--catalog",str(catalog)),
                         ("--orders",str(orders)+".missing","--catalog",str(catalog)),
                         ("--orders",str(orders)),
                         ("--orders",str(orders),"--catalog",str(catalog),"--catalog-url","http://127.0.0.1:1/catalog")]:
                failure = call(*args)
                self.assertEqual(failure.returncode, 2)
                self.assertEqual(failure.stdout, "")
                self.assertNotIn("Traceback", failure.stderr)
            self.assertEqual(orders.read_bytes(), b'sku,quantity\nPEN,2\nBOOK,')
            self.assertEqual(catalog.read_bytes(), CATALOG)

    def test_actual_local_http_and_cli(self):
        with fixture() as url, tempfile.TemporaryDirectory() as folder:
            self.assertEqual(report_cli.fetch_catalog(url), CATALOG)
            orders = Path(folder)/"orders.csv"
            orders.write_bytes(ORDERS)
            result = subprocess.run([sys.executable, str(Path(report_cli.__file__)),
                "--orders",str(orders),"--catalog-url",url],capture_output=True,text=True,timeout=5)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout), EXPECTED)

    def test_http_status_media_framing_and_schema_failures(self):
        cases = [{"status":503}, {"status":302}, {"media":"text/html"}, {"length":"65537"},
                 {"length":"x"}, {"length":"999"}, {"transfer":"chunked"}]
        for case in cases:
            with self.subTest(case=case), fixture(**case) as url, self.assertRaises(DataError):
                report_cli.fetch_catalog(url)
        with fixture(body=b'{') as url, self.assertRaises(DataError):
            build_report(ORDERS, report_cli.fetch_catalog(url))

    def test_url_boundary_and_connection_failure(self):
        for url in ["https://127.0.0.1:80/catalog", "http://example.com:80/catalog",
                    "http://localhost:80/catalog", "http://127.0.0.1:0/catalog",
                    "http://127.0.0.1:99999/catalog", "http://user@127.0.0.1:80/catalog",
                    "http://127.0.0.1:80/catalog?x=1", "http://127.0.0.1:80/other"]:
            with self.subTest(url=url), self.assertRaises(DataError):
                report_cli.fetch_catalog(url)
        with socket.socket() as held:
            held.bind(("127.0.0.1", 0))
            port = held.getsockname()[1]
            with self.assertRaises(OSError):
                report_cli.fetch_catalog(f"http://127.0.0.1:{port}/catalog")

    def test_timeout_configuration_and_no_fallback_output(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/"orders.csv"
            path.write_bytes(ORDERS)
            output, errors = io.StringIO(), io.StringIO()
            with patch("report_cli.http.client.HTTPConnection") as factory:
                factory.return_value.request.side_effect = TimeoutError("synthetic socket timeout")
                with contextlib.redirect_stdout(output), contextlib.redirect_stderr(errors):
                    code = report_cli.main(["--orders",str(path),"--catalog-url","http://127.0.0.1:8765/catalog"])
                factory.assert_called_once_with("127.0.0.1",8765,timeout=2)
                factory.return_value.close.assert_called_once()
            self.assertEqual(code, 2)
            self.assertEqual(output.getvalue(), "")
            self.assertIn("timeout", errors.getvalue())

    def test_output_failure_is_separate_from_validation(self):
        class Broken:
            def write(self, value):
                raise BrokenPipeError()
        with tempfile.TemporaryDirectory() as folder:
            orders, catalog = Path(folder)/"orders.csv", Path(folder)/"catalog.json"
            orders.write_bytes(ORDERS)
            catalog.write_bytes(CATALOG)
            errors = io.StringIO()
            with patch("report_cli.sys.stdout", Broken()), contextlib.redirect_stderr(errors):
                code = report_cli.main(["--orders",str(orders),"--catalog",str(catalog)])
            self.assertEqual(code, 1)
            self.assertIn("partial stream", errors.getvalue())
            self.assertEqual(orders.read_bytes(), ORDERS)
            self.assertEqual(catalog.read_bytes(), CATALOG)


if __name__ == "__main__":
    unittest.main()
