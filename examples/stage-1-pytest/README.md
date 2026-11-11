# Optional tools for Stage 1 Lesson 17

Verified with Python 3.12.3, pytest 9.2.0 and coverage.py 7.17.2. These packages are development tools; the academy frontend does not depend on them.

Use a fresh `.venv` destination in this folder:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
ACADEMY_PYTEST_PYTHON="$PWD/.venv/bin/python" node --experimental-strip-types --test ../../tests/python-pytest.test.mjs
```

On Windows use `py -m venv .venv` and `.\.venv\Scripts\python.exe`; set ACADEMY_PYTEST_PYTHON to the interpreter's absolute path with the environment syntax of your shell. Installation requires package distributions from the configured source. Pins do not establish every platform/interpreter combination.

The lesson provides complete quantity.py/test_quantity.py and capacity.py/test_capacity.py examples. Copy them into a fresh exercise folder and run the named files as instructed. Keep teardown_exercise.py separate: its assertion deliberately fails so that cleanup can be observed, and it should not be treated as part of a passing default suite.

ACADEMY_PYTEST_PYTHON selects the interpreter for this lesson's integration tests. ACADEMY_TEST_TOOLS can instead add a temporary package installation to its module search path. Tool integrations are explicitly skipped if pytest or coverage is unavailable. Skipped integrations are not passed checks. Standard-library reasoning/model checks still run. The repository's other lesson tests retain their own interpreter conventions.

Coverage integrations run the real pytest and coverage commands in disposable directories, including deliberately failing mutant/teardown exercises. Those child failures are expected evidence and are asserted by the academy tests. Generated reports are removed with the disposable workspace. Statement/branch counts are compared with the interactive model; the model is not a general Python coverage engine.

The maintained setup was verified using an isolated temporary package directory. A fresh combined venv installation and Windows/macOS execution were not independently verified.
