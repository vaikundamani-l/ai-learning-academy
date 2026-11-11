"""Teaching kernels on already-valid finite lists of bounded integers.

Counts deliberately measure only the named events, not CPU instructions/time.
Validation/input construction is outside the kernels' cost model.
"""
import json


def linear_find(values, target):
    comparisons = 0
    for index, value in enumerate(values):
        comparisons += 1
        if value == target:
            return index, comparisons
    return -1, comparisons


def unordered_pairs(n):
    visits = 0
    for i in range(n):
        for j in range(i + 1, n):
            visits += 1
    return visits


def halve_until_zero(n):
    steps = 0
    while n > 0:
        n //= 2
        steps += 1
    return steps


def copy_evens(values):
    output = []
    visits = 0
    for value in values:
        visits += 1
        if value % 2 == 0:
            output.append(value)
    return output, visits


def count_evens(values):
    count = 0
    visits = 0
    for value in values:
        visits += 1
        if value % 2 == 0:
            count += 1
    return count, visits


def contains_plain(values, target):
    # The timing example excludes count instrumentation, but includes this call.
    for value in values:
        if value == target:
            return True
    return False


if __name__ == "__main__":
    values = list(range(8))
    print(json.dumps({"first": linear_find(values, 0),
                      "last": linear_find(values, 7),
                      "absent": linear_find(values, -1),
                      "pairs": unordered_pairs(8),
                      "halvings": halve_until_zero(8),
                      "evens": copy_evens(values),
                      "even_count": count_evens(values)}, sort_keys=True))
