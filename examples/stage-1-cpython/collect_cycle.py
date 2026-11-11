"""Weak references observe lifetime without keeping the object alive."""
import gc
import json
import sys
import weakref


class Node:
    pass


def inspect():
    if sys.implementation.name != "cpython" or sys.version_info[:2] != (3, 12):
        raise RuntimeError("This lifetime observation targets CPython 3.12 only")
    was_enabled = gc.isenabled()
    gc.disable()  # Disable automatic cyclic collection for this controlled experiment.
    try:
        node = Node()
        probe = weakref.ref(node)
        node.link = node
        del node
        before = probe() is not None  # no surviving strong binding to the result
        assert before
        gc.collect()  # explicit collection still runs while automatic GC is disabled
        after = probe() is None
        assert after
        return {"alive_before_explicit_collection": before,
                "gone_after_explicit_collection": after}
    finally:
        if was_enabled:
            gc.enable()


if __name__ == "__main__":
    print(json.dumps(inspect(), sort_keys=True))
