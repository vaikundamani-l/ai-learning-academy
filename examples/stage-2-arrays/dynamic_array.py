"""A pedagogical dynamic array with explicit fixed-length backing lists.

Python's list provides the storage primitive; we never call append/insert/pop on
that backing list. This models reference movement, not CPython's allocation policy.
"""
_EMPTY = object()


def allocate(capacity):
    return [_EMPTY] * capacity


class DynamicArray:
    def __init__(self, growth="double"):
        if growth not in ("double", "one"):
            raise ValueError("growth must be double or one")
        self._data = []
        self._size = 0
        self.growth = growth
        self.reset_counts()

    def reset_counts(self):
        self.counts = {"initialized": 0, "copies": 0, "shifts": 0,
                       "stores": 0, "clears": 0}
        self.peak_slots = self.capacity

    @property
    def capacity(self):
        return len(self._data)

    def __len__(self):
        return self._size

    def _index(self, index, insertion=False):
        if type(index) is not int:
            raise TypeError("index must be an exact integer")
        limit = self._size + (1 if insertion else 0)
        if not 0 <= index < limit:
            raise IndexError("index outside live range")

    def at(self, index):
        self._index(index)
        return self._data[index]

    def _ensure_space(self):
        if self._size < self.capacity:
            return
        capacity = (max(1, self.capacity * 2) if self.growth == "double"
                    else self.capacity + 1)
        # Allocate/copy before changing the published backing reference.
        fresh = allocate(capacity)
        for i in range(self._size):
            fresh[i] = self._data[i]
        self.peak_slots = max(self.peak_slots, self.capacity + capacity)
        self.counts["initialized"] += capacity
        self.counts["copies"] += self._size
        self._data = fresh

    def append(self, value):
        self._ensure_space()
        self._data[self._size] = value
        self.counts["stores"] += 1
        self._size += 1

    def insert(self, index, value):
        self._index(index, insertion=True)
        self._ensure_space()
        # Move right-to-left so unread source references are not overwritten.
        for destination in range(self._size, index, -1):
            self._data[destination] = self._data[destination - 1]
            self.counts["shifts"] += 1
        self._data[index] = value
        self.counts["stores"] += 1
        self._size += 1

    def pop(self, index=None):
        if index is None:
            index = self._size - 1
        self._index(index)
        result = self._data[index]
        for destination in range(index, self._size - 1):
            self._data[destination] = self._data[destination + 1]
            self.counts["shifts"] += 1
        self._data[self._size - 1] = _EMPTY
        self.counts["clears"] += 1
        self._size -= 1
        return result

    def snapshot(self):
        # Debug/verification helper: O(n) and allocates a separate outer list.
        return [self._data[i] for i in range(self._size)]

    def check_invariants(self):
        # Debug scan, excluded from each operation's complexity/counters.
        assert 0 <= self._size <= self.capacity
        assert all(self._data[i] is not _EMPTY for i in range(self._size))
        assert all(self._data[i] is _EMPTY for i in range(self._size, self.capacity))
