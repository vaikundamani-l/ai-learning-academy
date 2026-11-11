"""Built-in container copies: mutable isolation, shared children and cycles."""
import copy
import json


def inspect():
    inner = [1, 2]
    original = [inner, inner]
    shallow = original.copy()
    deep = copy.deepcopy(original)
    assert original is not shallow and shallow[0] is original[0]
    assert deep is not original and deep[0] is not inner
    assert deep[0] is deep[1]  # memo preserves repeated references within the copy
    assert deep[0][0] is original[0][0]  # immutable int reused by this copy policy
    inner.append(99)
    assert shallow == [[1, 2, 99], [1, 2, 99]]
    assert deep == [[1, 2], [1, 2]]
    ring = []
    ring.append(ring)
    cloned = copy.deepcopy(ring)
    assert cloned is not ring and cloned[0] is cloned
    return {"shallow_shares_inner": shallow[0] is inner,
            "deep_shares_original_inner": deep[0] is inner,
            "deep_reuses_child": deep[0] is deep[1],
            "integer_atom_shared": deep[0][0] is original[0][0],
            "deep_after_original_mutation": deep,
            "copied_cycle_points_to_copy": cloned[0] is cloned}


if __name__ == "__main__":
    print(json.dumps(inspect(), sort_keys=True))
