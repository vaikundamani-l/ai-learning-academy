"""JSON storage for one writer in a trusted local directory; not a database server."""
import json
import os
from pathlib import Path
from tempfile import NamedTemporaryFile
from task_domain import validate_state, empty_state

MAX_BYTES = 32768


class StoreError(ValueError):
    pass


def checked_path(path):
    path = Path(path)
    if path.is_symlink():
        raise StoreError("symbolic-link database paths are unsupported")
    return path


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise StoreError("duplicate JSON key")
        result[key] = value
    return result


def reject_constant(value):
    raise StoreError("nonstandard JSON constant")


def encode_state(state):
    validate_state(state)
    payload = (json.dumps(state, ensure_ascii=False, allow_nan=False,
                          sort_keys=True, indent=2) + "\n").encode("utf-8")
    if len(payload) > MAX_BYTES:
        raise StoreError("database exceeds 32768 bytes")
    return payload


def load_state(path):
    path = checked_path(path)
    try:
        with path.open("rb") as source:
            payload = source.read(MAX_BYTES + 1)
    except FileNotFoundError as error:
        raise StoreError("database missing; initialize the chosen path explicitly") from error
    if len(payload) > MAX_BYTES:
        raise StoreError("database exceeds 32768 bytes")
    try:
        state = json.loads(payload.decode("utf-8"), object_pairs_hook=unique_object,
                           parse_constant=reject_constant)
    except (UnicodeError, ValueError, RecursionError) as error:
        raise StoreError("invalid database JSON; existing bytes were not changed") from error
    return validate_state(state)


def write_payload(target, payload):
    if target.write(payload) != len(payload):
        raise OSError("incomplete staged write")
    target.flush()
    os.fsync(target.fileno())


def initialize(path):
    path = checked_path(path)
    payload = encode_state(empty_state())
    created = False
    try:
        with path.open("xb") as target:
            created = True
            write_payload(target, payload)
    except BaseException:
        if created:
            path.unlink(missing_ok=True)
        raise


def save_state(path, state):
    path = checked_path(path)
    payload = encode_state(state)
    temporary = None
    try:
        with NamedTemporaryFile(mode="wb", dir=path.parent,
                                prefix=f".{path.name}.", suffix=".tmp", delete=False) as target:
            temporary = Path(target.name)
            write_payload(target, payload)
        os.replace(temporary, path)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
