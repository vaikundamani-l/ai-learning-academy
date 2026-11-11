# Stage 1 capstone: checked sales report

Run from this folder using Python 3.12+ (standard library only):

```sh
python3 report_cli.py --orders orders.csv --catalog catalog.json
python3 -m unittest -v test_report
```

Expected report: row_count 3; BOOK quantity 1 × 450 cents = 450;
PEN quantity 5 × 125 cents = 625; total_cents 1075. Items are sorted by sku.

For the synthetic request path, in a second terminal run:

```sh
python3 serve_catalog.py --port 8765
```

Then run:

```sh
python3 report_cli.py --orders orders.csv --catalog-url http://127.0.0.1:8765/catalog
```

Stop the fixture with Ctrl-C. If its port is occupied, select another port in both commands.
Use your selected Python executable (`py` is common on Windows). Windows/macOS are not independently verified.

## Contract

- Explicit input paths; exactly one catalog source. Inputs are never rewritten.
- Each payload at most 65536 bytes, exact UTF-8 without a BOM.
- CSV header exactly `sku,quantity`; 1–1000 nonblank data records; exact two fields.
  Standard CSV quoting/CRLF is accepted. Empty rows are errors. Physical line diagnostics
  come from csv.reader.line_num (end of a record, including quoted newlines).
- Product code `[A-Z][A-Z0-9_-]{0,15}`; quantity ASCII digits 1–9999, no leading zeros/signs/whitespace.
- Catalog exact fields version (integer 1) and prices_cents (1–100 products).
  Exact integer prices 1–1000000 cents; duplicate JSON keys, booleans, nonstandard constants,
  unknown products and missing quantities are rejected, never silently coerced/skipped.
- Repeated product rows are intentional separate order entries and are summed; this is NOT
  deduplication. One configured currency only, prices already expressed in its integer cents;
  taxes, discounts, FX, refunds and non-cent currencies are outside this model.
- Validation/input/network failures: exit 2, useful stderr, no report stdout.
  One complete JSON string is constructed only after every row validates.
- Output failure: exit 1; some bytes may already have reached the consumer. Buffering a report
  does not make an unrelated pipe or shell redirection transactional. Check exit status AND parse
  a complete report. Do not redirect over a valuable file; shell redirection can truncate it before
  Python runs. A durable output-file publication protocol is independent work.

## Local HTTP scope and limits

Only `http://127.0.0.1:PORT/catalog` is allowed; no DNS, TLS, authentication, proxy, redirects,
retry or stale cache fallback. Require status 200, application/json, a bounded Content-Length,
no Transfer-Encoding, then validate returned JSON/schema. The 2-second socket timeout limits
individual blocking operations; it is NOT a total elapsed deadline against a slow peer. Byte
and record caps do not imply constant memory, a full HTTP security implementation or internet
readiness. Use the earlier HTTP lesson for broader framing/deadline discussion. The fixture is
synthetic and listens only on loopback. No external endpoint is contacted by these examples/tests.

## Independent extension

Build a warehouse-quantity report from `sku,received,shipped`, reject shipped greater than received,
validate a later row before publishing anything, and test zero stock, malformed fields and failed requests.
Write expected arithmetic independently. Explain exactly which inputs are accepted and why a success
report cannot silently omit an invalid row. This transfer remains learner work; passing the reference
project tests alone is not mastery of Stage 1.
