# Stage 2 Lesson 1: operation counts and complexity

Run with the selected Python interpreter (verified on CPython 3.12.3):

```sh
python3 operation_counts.py
python3 measure_search.py
```

No dependencies or external requests. Kernels assume already-valid finite lists of bounded integers;
size n is nonnegative. Validation and input construction are outside their analysis.
Do not use these minimal teaching functions as untrusted-input service boundaries.

For list(range(8)): first search returns index 0 / 1 equality comparison;
last search returns index 7 / 8 comparisons; absent returns -1 / 8 comparisons.
Unordered pair visits = 28; integer halvings until zero = 4; copying evens
returns [0,2,4,6] / 8 visits; counting evens returns 4 / 8 visits.

Counting selected events is not counting all loop tests, assignments, CPU instructions or seconds.
Repeated rows, comparisons or appends have the declared fixed-size/word cost model. Python's arbitrary
precision integer costs and actual list allocation capacity/bytes are outside this model.
Halving mutates a local integer, not a copy of an n-element input. A returned list containing k
references has k logical output slots, with implementation-dependent allocated capacity.

measure_search measures an absent target, three samples of 100 calls per size. It reports the full
seconds-per-call vector, minimum and interpreter. Input creation is excluded; function/callable
and loop overhead remain. timeit normally disables automatic garbage collection during timing.
These observations do not prove a universal ratio, asymptotic bound, fastest implementation or latency
of a file/network/application pipeline. No browser animation delay is presented as benchmark data.

Independent transfer: two separate scans of lists of length n use 2n item visits; an n-by-m nested
scan uses nm pair visits. When m is fixed at 3, growth in n is linear; when m=n it is quadratic.
Derive counts first, implement independent counters and test n/m equal to 0,1 and larger values.
