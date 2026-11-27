# Stage 2 arrays and dynamic storage

Run the standard-library example with the selected Python interpreter (verified CPython 3.12.3):

```sh
python3 array_demo.py
```

DynamicArray supports append, strict-index at/insert/pop, size/capacity, snapshots and debug checks.
Indices are exact nonnegative integers; bool/negative indexing is refused, and insert accepts 0…size.
This deliberately differs from Python list's negative indexing and insertion clamping.
Empty pop raises IndexError. None is valid data; a private sentinel marks unused slots.
An index is a position, not a permanent identity for a stored item.

Backing storage is a Python list created at a fixed length. We manage length/capacity and movement
explicitly without its append/insert/pop methods. This is not a new low-level allocator or an exact
CPython list simulator. Copies and shifts move references; nested payloads are not deep copied.
The doubling and +1 policies are teaching choices, not claims about Python's actual growth factor.

Counters separate initialized capacity slots, copied live references on growth, shifted references,
new stores and cleared slots. Allocation fills the fresh buffer before any live references are copied;
both old and new buffers coexist during growth. peak_slots counts that combined logical storage,
not process RSS, payload bytes or total allocations over time. Snapshots cost O(n); invariant scans cost O(capacity), which can exceed n after removals.
Both are debug helpers excluded from the kernel counters/cost analysis. MemoryError from allocating a new
buffer occurs before the array state/counters change; arbitrary finalizer/concurrent mutation behavior
is not supported. Do not mutate the internal backing list or pass the private sentinel as user data.

For eight appends from empty using doubling: capacity 8; 15 initialized slots, 7 reference copies,
8 stores = 30 cumulative selected units. At the fifth append, initializing 8 + copying 4 + storing 1
costs 13 selected units; old capacity 4 + new 8 = 12 peak logical slots.
Using +1 growth: 36 initialized slots + 28 copies + 8 stores = 72 units.
The append-only doubling bound is less than 7m units for m≥1 in this model; it does not make each
append worst-case constant, and it does not apply to repeated front insertion or arbitrary reserve work.

There is deliberately no shrinking on pop. Removed slots are cleared to release references, but
capacity can remain large. A shrink policy needs slack/hysteresis to avoid costly repeated resizing.
Production designs also need allocation failure, concurrency, cache, lifecycle and workload analysis.

Independent transfer: implement stable remove_all(value) with one compaction pass rather than
repeated front removals. Return the number removed, retain survivor order, clear the old tail and
keep capacity unchanged. [10,20,10,30] removing 10 becomes [20,30] with count 2. Test no/all matches,
None, aliases and empty input. Count input visits, survivor moves and tail clears independently.
A shrink-policy extension must state thresholds and test alternating operations around them
before claiming amortized bounds.
