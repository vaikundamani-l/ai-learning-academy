# CPython memory and bytecode observations

Run from this folder with a standard CPython 3.12 interpreter (verified locally on 3.12.3):

```sh
python3 inspect_references.py
python3 copy_graphs.py
python3 collect_cycle.py
python3 inspect_bytecode.py
python3 -m dis inspect_bytecode.py
```

Reference counts are observations, not portable expected absolute numbers.
inspect_references compares only the +1/-1 delta for an ordinary list in a controlled function;
sys.getrefcount itself introduces a temporary reference. Runtime caches, immortal objects,
other strong references and other builds prevent treating count-minus-one as a universal census.
Do not modify an object's reference count using ctypes.

copy_graphs shows separate mutable list containers, immutable atom reuse, repeated-reference
preservation through deepcopy's memo and a copied self-cycle. Custom __deepcopy__ policies,
external resources and arbitrary objects are not promised to become fully isolated.

collect_cycle uses a weak reference to avoid keeping the observed Node alive, disables automatic
cyclic collection locally, explicitly collects and restores the previous automatic-GC state.
It does not assert a universal collection count, timing or reduction in process memory.
Use context managers for resource lifetime rather than relying on a collection schedule.

inspect_bytecode reads actual dis instructions with caches/adaptive specializations hidden and
replays only RESUME, LOAD_FAST, multiplication/addition BINARY_OP and RETURN_VALUE for one fixed
function. It checks every stack-length delta against dis.stack_effect and compares with the
real Python result. This is not a general Python VM, tracing actual execution, native CPU code
or a promise that other Python versions have the same opcodes. The final command disassembles
the complete module without running its main block; it includes nested function code too.

The reference-count, collection and bytecode programs fail explicitly on other implementations/
minor versions rather than showing a falsely portable result. Test locally before adapting them.
No dependency installation, internet access or unmanaged real resources are required.
