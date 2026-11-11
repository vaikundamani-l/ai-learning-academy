"""Bounded parsing and pure report construction; no filesystem or network I/O."""
import csv
import io
import json
import re

MAX_BYTES = 65536
MAX_ROWS = 1000
SKU = re.compile(r"[A-Z][A-Z0-9_-]{0,15}")
QUANTITY = re.compile(r"[1-9][0-9]{0,3}")


class DataError(ValueError):
    pass


def text_payload(payload, source):
    if len(payload) > MAX_BYTES:
        raise DataError(f"{source}: exceeds {MAX_BYTES} bytes")
    try:
        return payload.decode("utf-8")
    except UnicodeError as error:
        raise DataError(f"{source}: expected UTF-8") from error


def unique_keys(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def reject_constant(value):
    raise ValueError(f"nonstandard JSON constant {value}")


def parse_catalog(payload):
    text = text_payload(payload, "catalog")
    try:
        value = json.loads(text, object_pairs_hook=unique_keys,
                           parse_constant=reject_constant)
    except (ValueError, RecursionError) as error:
        raise DataError("catalog: invalid JSON") from error
    if (type(value) is not dict or set(value) != {"version", "prices_cents"}
            or type(value["version"]) is not int or value["version"] != 1):
        raise DataError("catalog: expected version 1 and prices_cents")
    prices = value["prices_cents"]
    if type(prices) is not dict or not 1 <= len(prices) <= 100:
        raise DataError("catalog: expected 1–100 product prices")
    for sku, price in prices.items():
        if not SKU.fullmatch(sku):
            raise DataError("catalog: invalid product code")
        if type(price) is not int or not 1 <= price <= 1000000:
            raise DataError(f"catalog: {sku} price must be integer cents 1–1000000")
    return prices


def parse_orders(payload):
    text = text_payload(payload, "orders")
    reader = csv.reader(io.StringIO(text, newline=""), strict=True)
    records = []
    try:
        if next(reader, None) != ["sku", "quantity"]:
            raise DataError("orders: expected header sku,quantity")
        for row in reader:
            line = reader.line_num
            if len(records) >= MAX_ROWS:
                raise DataError(f"orders line {line}: exceeds {MAX_ROWS} rows")
            if len(row) != 2:
                raise DataError(f"orders line {line}: expected two fields")
            sku, quantity = row
            if not SKU.fullmatch(sku):
                raise DataError(f"orders line {line}: invalid or missing sku")
            if not QUANTITY.fullmatch(quantity):
                raise DataError(f"orders line {line}: quantity must be digits 1–9999")
            records.append((line, sku, int(quantity)))
    except csv.Error as error:
        raise DataError(f"orders line {reader.line_num}: malformed CSV") from error
    if not records:
        raise DataError("orders: expected at least one data row")
    return records


def build_report(order_payload, catalog_payload):
    prices = parse_catalog(catalog_payload)
    records = parse_orders(order_payload)
    quantities = {}
    for line, sku, quantity in records:
        if sku not in prices:
            raise DataError(f"orders line {line}: unknown sku {sku}")
        quantities[sku] = quantities.get(sku, 0) + quantity
    items = [{"sku": sku, "quantity": quantities[sku],
              "unit_cents": prices[sku],
              "subtotal_cents": quantities[sku] * prices[sku]}
             for sku in sorted(quantities)]
    return {"version": 1, "row_count": len(records), "items": items,
            "total_cents": sum(item["subtotal_cents"] for item in items)}
