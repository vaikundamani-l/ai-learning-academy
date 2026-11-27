"""Trace append work for two policies; counters are not timings or byte counts."""
import json
from dynamic_array import DynamicArray


def append_history(growth, count=8):
    array = DynamicArray(growth)
    rows = []
    for value in range(count):
        before = sum(array.counts.values())
        array.append(value)
        array.check_invariants()
        rows.append({"size": len(array), "capacity": array.capacity,
                     "counts": array.counts.copy(), "peak_slots": array.peak_slots,
                     "this_append_units": sum(array.counts.values()) - before})
    return rows


if __name__ == "__main__":
    print(json.dumps({policy: append_history(policy) for policy in ["double", "one"]}, sort_keys=True))
