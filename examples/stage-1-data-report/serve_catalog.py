"""Synthetic loopback fixture. Run from this project folder, then stop with Ctrl-C."""
import argparse
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

BODY = json.dumps({"version": 1, "prices_cents": {"PEN": 125, "BOOK": 450}}).encode()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/catalog":
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(BODY)))
        self.end_headers()
        self.wfile.write(BODY)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Serve a synthetic local catalog.")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    with HTTPServer(("127.0.0.1", args.port), Handler) as server:
        print(f"Fixture: http://127.0.0.1:{server.server_port}/catalog", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
