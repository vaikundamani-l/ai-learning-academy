"""Read explicit inputs and publish one complete JSON report on stdout."""
import argparse
import http.client
import json
from pathlib import Path
import sys
from urllib.parse import urlsplit
from report_core import DataError, MAX_BYTES, build_report


def read_payload(path):
    with path.open("rb") as handle:
        return handle.read(MAX_BYTES + 1)


def fetch_catalog(url):
    # Literal IPv4 loopback only: this is a local fixture client, not a web fetcher.
    try:
        parts = urlsplit(url)
        port = parts.port
    except ValueError as error:
        raise DataError("catalog URL: invalid port or syntax") from error
    if (parts.scheme != "http" or parts.netloc != f"127.0.0.1:{port}"
            or port is None or not 1 <= port <= 65535
            or parts.path != "/catalog" or parts.query or parts.fragment):
        raise DataError("catalog URL: use http://127.0.0.1:PORT/catalog only")
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
    try:
        connection.request("GET", "/catalog", headers={"Accept": "application/json"})
        response = connection.getresponse()
        if response.status != 200:
            raise DataError(f"catalog request: expected HTTP 200, got {response.status}")
        if response.getheader("Content-Type", "").split(";", 1)[0].strip().lower() != "application/json":
            raise DataError("catalog request: expected application/json")
        # A finite Content-Length contract avoids silently accepting incomplete bodies.
        length = response.getheader("Content-Length", "")
        if (not length.isascii() or not length.isdecimal()
                or len(length) > 6 or int(length) > MAX_BYTES
                or response.getheader("Transfer-Encoding") is not None):
            raise DataError("catalog request: require bounded Content-Length without Transfer-Encoding")
        payload = response.read(int(length) + 1)
        if len(payload) != int(length):
            raise DataError("catalog request: incomplete body")
        return payload
    finally:
        connection.close()


def main(argv=None):
    parser = argparse.ArgumentParser(description="Validate orders and publish a complete sales report.")
    parser.add_argument("--orders", type=Path, required=True)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--catalog", type=Path)
    source.add_argument("--catalog-url")
    args = parser.parse_args(argv)
    try:
        orders = read_payload(args.orders)
        catalog = read_payload(args.catalog) if args.catalog else fetch_catalog(args.catalog_url)
        report = build_report(orders, catalog)
        rendered = json.dumps(report, sort_keys=True, allow_nan=False) + "\n"
    except (DataError, OSError, http.client.HTTPException) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    try:
        sys.stdout.write(rendered)
        sys.stdout.flush()
    except BrokenPipeError:
        print("error: output unavailable; a partial stream may have been delivered", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
