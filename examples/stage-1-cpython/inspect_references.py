"""Controlled observations on ordinary lists, targeting CPython 3.12."""
import json
import platform
import sys


def inspect():
    if sys.implementation.name != "cpython" or sys.version_info[:2] != (3, 12):
        raise RuntimeError("This reference-count observation targets CPython 3.12 only")
    values = [10, 20]
    first = sys.getrefcount(values)
    alias = values
    second = sys.getrefcount(values)
    del alias
    third = sys.getrefcount(values)
    # Compare a controlled delta; never infer all references by subtracting one.
    assert second - first == 1
    assert third == first
    copied = values.copy()
    assert copied is not values and copied == values
    identity = id(values)
    values.append(30)
    assert id(values) == identity
    assert copied == [10, 20]
    a = 100
    b = a
    a = a + 1
    assert (a, b) == (101, 100)
    return {"implementation": platform.python_implementation(),
            "version": platform.python_version(),
            "observed_counts": [first, second, third],
            "alias_delta": second - first, "release_delta": third - second,
            "list_identity_preserved": id(values) == identity,
            "integer_values": [a, b]}


if __name__ == "__main__":
    print(json.dumps(inspect(), sort_keys=True))
