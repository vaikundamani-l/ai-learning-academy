# Optional tools for Stage 1 Lesson 11

These versions were verified with Python 3.12.3. Use an isolated environment; the academy frontend does not depend on these Python packages.

From this folder, with a fresh `.venv` destination:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
ACADEMY_PYTHON="$PWD/.venv/bin/python" node --experimental-strip-types --test ../../tests/python-typing-profiling.test.mjs
```

The installation requires the distributions to be available from the configured package source. On Windows, use `py -m venv .venv`, then `.\.venv\Scripts\python.exe`; set `ACADEMY_PYTHON` to that interpreter's absolute path using your shell's environment-variable syntax before running Node.

The test file uses `ACADEMY_PYTHON` when set and otherwise uses `python3`. `ACADEMY_TYPING_TOOLS` can add an isolated installation directory to Python's module search path for verification. Mypy/Pydantic integration tests are explicitly skipped if those modules are absent; a skipped check is not a passed integration. The standard-library examples and performance-model checks still run. To include the optional integrations, use the declared tool environment above.

Benchmark tests check equivalent outputs, finite samples and unit conversion. They do not assert a speed winner or a universal speed ratio. Profiler tests verify workload results and actual call counts, not a fixed timing table. Temporary input modules and test directories are cleaned up by the tests.

The full academy suite can also use the selected interpreter for this lesson's tests by keeping `ACADEMY_PYTHON` set while running the project's usual Node test command. Other lesson test files retain their own interpreter selection.
