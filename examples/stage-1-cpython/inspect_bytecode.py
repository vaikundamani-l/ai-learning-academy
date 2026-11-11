"""Disassemble and replay one deliberately restricted CPython 3.12 function."""
import dis
import json
import platform
import sys


def calculate(a, b, c):
    return (a * b) + c


def inspect(a=2, b=3, c=4):
    if sys.implementation.name != "cpython" or sys.version_info[:2] != (3, 12):
        raise RuntimeError("This bytecode replay targets CPython 3.12 only")
    names = {"a": a, "b": b, "c": c}
    stack, frames = [], []
    result = None
    instructions = dis.get_instructions(calculate, adaptive=False, show_caches=False)
    for instruction in instructions:
        before = len(stack)
        if instruction.opname == "RESUME":
            pass  # Interpreter bookkeeping; no value-stack change in this example.
        elif instruction.opname == "LOAD_FAST":
            stack.append(names[instruction.argval])
        elif instruction.opname == "BINARY_OP" and instruction.argrepr in ("*", "+"):
            right, left = stack.pop(), stack.pop()
            stack.append(left * right if instruction.argrepr == "*" else left + right)
        elif instruction.opname == "RETURN_VALUE":
            result = stack.pop()
        else:
            raise RuntimeError(f"Unsupported instruction for this tiny replay: {instruction.opname}")
        effect = (dis.stack_effect(instruction.opcode) if instruction.arg is None
                  else dis.stack_effect(instruction.opcode, instruction.arg))
        assert len(stack) - before == effect
        frames.append({"op": instruction.opname, "argument": instruction.argrepr,
                       "stack": stack.copy(), "effect": effect})
    assert not stack and result == calculate(a, b, c)
    return {"implementation": platform.python_implementation(),
            "version": platform.python_version(), "inputs": names,
            "result": result, "frames": frames}


if __name__ == "__main__":
    print(json.dumps(inspect(), sort_keys=True))
