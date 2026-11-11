"""Pure task transitions for the bounded, single-writer teaching app."""
MAX_TASKS = 100
MAX_ID = 9999


class TaskError(ValueError):
    pass


def checked_title(title):
    if (type(title) is not str or not 1 <= len(title) <= 80
            or title != title.strip() or not all(char.isprintable() for char in title)):
        raise TaskError("title must be 1–80 printable characters without outer whitespace")
    return title


def validate_state(state):
    if type(state) is not dict or set(state) != {"version", "next_id", "tasks"}:
        raise TaskError("database must contain version, next_id and tasks")
    if type(state["version"]) is not int or state["version"] != 1:
        raise TaskError("unsupported database version")
    if type(state["next_id"]) is not int or not 1 <= state["next_id"] <= MAX_ID + 1:
        raise TaskError("invalid next_id")
    if type(state["tasks"]) is not list or len(state["tasks"]) > MAX_TASKS:
        raise TaskError("database allows at most 100 tasks")
    seen = set()
    for task in state["tasks"]:
        if type(task) is not dict or set(task) != {"id", "title", "done"}:
            raise TaskError("invalid task fields")
        if type(task["id"]) is not int or not 1 <= task["id"] <= MAX_ID:
            raise TaskError("invalid task id")
        if task["id"] in seen:
            raise TaskError("duplicate task id")
        seen.add(task["id"])
        checked_title(task["title"])
        if type(task["done"]) is not bool:
            raise TaskError("done must be a boolean")
    if seen and state["next_id"] <= max(seen):
        raise TaskError("next_id must exceed all saved task ids")
    return state


def empty_state():
    return {"version": 1, "next_id": 1, "tasks": []}


def add_task(state, title):
    validate_state(state)
    checked_title(title)
    if len(state["tasks"]) >= MAX_TASKS:
        raise TaskError("task capacity reached")
    if state["next_id"] > MAX_ID:
        raise TaskError("task id range exhausted")
    task = {"id": state["next_id"], "title": title, "done": False}
    candidate = {"version": 1, "next_id": state["next_id"] + 1,
                 "tasks": [dict(item) for item in state["tasks"]] + [task]}
    return candidate, task


def complete_task(state, task_id):
    validate_state(state)
    if type(task_id) is not int or not 1 <= task_id <= MAX_ID:
        raise TaskError("id must be an integer from 1 to 9999")
    selected = next((item for item in state["tasks"] if item["id"] == task_id), None)
    if selected is None:
        raise TaskError("task id not found")
    if selected["done"]:
        return state, dict(selected), False
    tasks = [dict(item) for item in state["tasks"]]
    changed = next(item for item in tasks if item["id"] == task_id)
    changed["done"] = True
    return {"version": 1, "next_id": state["next_id"], "tasks": tasks}, changed, True
