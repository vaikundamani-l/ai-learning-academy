"""Measure a fixed absent-target workload; no fixed timing/winner assertion."""
import json
import platform
import timeit
from operation_counts import contains_plain


def measure():
    measurements = []
    for n in [128, 1024, 2048]:
        values = list(range(n))  # input preparation is outside timed region
        assert contains_plain(values, -1) is False
        timer = timeit.Timer(lambda: contains_plain(values, -1))
        repetitions, calls = 3, 100
        elapsed = timer.repeat(repeat=repetitions, number=calls)
        measurements.append({"n": n, "case": "target absent", "calls_per_sample": calls,
                             "seconds_per_call": [sample / calls for sample in elapsed],
                             "minimum_seconds_per_call": min(elapsed) / calls})
    return {"implementation": platform.python_implementation(),
            "version": platform.python_version(),
            "scope": "plain search + callable overhead; excludes input creation",
            "measurements": measurements}


if __name__ == "__main__":
    print(json.dumps(measure(), sort_keys=True))
