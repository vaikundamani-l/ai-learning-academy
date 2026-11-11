import type {ReasoningChallengeData} from './pythonReasoningChallenges';
export const budgetClassDefinition=`class Budget:
    def __init__(self, limit):
        if type(limit) is not int:
            raise TypeError("limit must be an integer")
        if limit < 0 or limit > 60:
            raise ValueError("limit must be from 0 to 60")
        self._limit = limit
        self._used = 0

    def add(self, minutes):
        if type(minutes) is not int:
            raise TypeError("minutes must be an integer")
        if minutes < 0:
            raise ValueError("minutes must be nonnegative")
        if self._used + minutes > self._limit:
            raise ValueError("budget exceeded")
        self._used = self._used + minutes

    def total(self):
        return self._used

    def remaining(self):
        return self._limit - self._used`;
export const plannerDefinition=`class MemoryLog:
    def __init__(self):
        self._entries = []

    def record(self, minutes):
        self._entries.append(minutes)

    def entries(self):
        return self._entries.copy()


class StudyPlanner:
    def __init__(self, budget, recorder):
        self._budget = budget
        self._recorder = recorder

    def schedule(self, minutes):
        self._budget.add(minutes)
        self._recorder.record(minutes)`;
export const classExamples=[
 {title:'sessions.py',code:'class Session:\n    def __init__(self, name, minutes):\n        self.name = name\n        self.minutes = minutes\n\n    def label(self):\n        return f"{self.name}: {self.minutes}"\n\nfirst = Session("Ada", 20)\nsecond = Session("Lee", 30)\nprint(first.label())\nprint(Session.label(first))\nalias = first\nalias.minutes = 25\nprint(first.minutes, second.minutes)\nprint(first is second)',output:'Ada: 20\nAda: 20\n25 30\nFalse',explanation:'class creates the Session type. Each successful class call gives the caller a distinct instance here. __init__ initializes its attributes. Calling first.label() supplies first as self; the explicit Session.label(first) demonstrates the same ordinary method operation. alias reaches first’s instance, so its attribute update affects first but not second. This first example assumes suitable inputs; the class does not validate them automatically.'},
 {title:'budget_checks.py',fixtures:{'budget_model.py':budgetClassDefinition},code:'from budget_model import Budget\n\nbudget = Budget(20)\nbudget.add(5)\nbudget.add(10)\nprint(budget.total(), budget.remaining())\ntry:\n    budget.add(6)\nexcept ValueError as error:\n    print("Rejected:", error)\nprint(budget.total(), budget.remaining())',output:'15 5\nRejected: budget exceeded\n15 5',explanation:'The allowed state is 0 <= used <= limit <= 60. Adding 6 to 15 would exceed 20, so the guard raises before assigning a new _used value. The prior accepted total stays 15 and remaining stays 5. Type errors are different failures: True and "10" are not accepted as exact integer minutes.'},
 {title:'use_planner.py',fixtures:{'budget_model.py':budgetClassDefinition,'planner.py':plannerDefinition},code:'from budget_model import Budget\nfrom planner import MemoryLog, StudyPlanner\n\nbudget = Budget(30)\nlog = MemoryLog()\nplanner = StudyPlanner(budget, log)\nplanner.schedule(10)\nplanner.schedule(15)\nprint(budget.remaining())\nprint(log.entries())\ncopy = log.entries()\ncopy.append(99)\nprint(log.entries())',output:'5\n[10, 15]\n[10, 15]',explanation:'StudyPlanner has a budget and a recorder. schedule asks the budget to accept the amount, then asks the recorder to record it. Returning a shallow copy from entries prevents an append to the returned outer list from changing the log. The entries are integers; a shallow copy would not isolate mutable objects nested inside that list.'},
];
export const sharedClassReasoning:ReasoningChallengeData={
 id:'class-or-instance-list',title:'Does each instance own its list?',
 question:'Predict both output lines. Explain where the list is created and why two distinct instances can still observe one mutable list.',
 transfer:'Add a second topic through b. Which instance sees it in each version? Does making a second instance automatically copy a class attribute?',
 variants:[
 {title:'Mutable list on the class',code:'class Group:\n    topics = []\n\na = Group()\nb = Group()\na.topics.append("cpu")\nprint(a.topics)\nprint(b.topics)',output:"['cpu']\n['cpu']",steps:['The class body creates one topics list on Group. Neither instance has its own topics attribute.','Attribute lookup through a reaches the class list; append changes that object.','b resolves the same class attribute, so it observes the change. Distinct instances do not imply every referenced object is distinct.']},
 {title:'New list during each initialization',code:'class Group:\n    def __init__(self):\n        self.topics = []\n\na = Group()\nb = Group()\na.topics.append("cpu")\nprint(a.topics)\nprint(b.topics)',output:"['cpu']\n[]",steps:['Each ordinary Group() call invokes initialization for its own instance.','The list expression [] runs once per initialization and creates a new list each time.','Appending through a changes only a’s list; b’s list remains empty. Use this pattern for per-instance mutable state.']},
 ]};
const checks:[string,string[],number,string][]=[
 ['What is an instance in this lesson?',['A source filename','An individual object created from the class','The same thing as every class attribute'],1,'The class defines a type; instances have individual identities and state.'],
 ['What does self refer to during budget.add(5)?',['The instance receiving that method call','Every Budget instance at once','A special global variable'],0,'Ordinary bound method calls supply the receiver as the first argument.'],
 ['Does __init__ return the newly allocated instance?', ['Always','Only for lists','No; it initializes the instance and must return None'],2,'Allocation and initialization are distinct; the ordinary class call supplies the initialized instance to its caller.'],
 ['Why validate an add before updating _used?',['To hide all exceptions','To preserve the previous valid state when rejected','To make invalid inputs valid'],1,'A rejected add does not assign the proposed invalid total.'],
 ['Does a leading underscore make an attribute inaccessible?', ['No, it is a non-public convention','Yes, it is a security boundary','Only when running tests'],0,'Callers can still bypass this convention; these guards protect the documented API path.'],
 ['Why is topics = [] in the class body surprising?', ['It creates a new list for each access','It is always immutable','Instances may all reach that same class-level list'],2,'Create per-instance mutable state inside initialization.'],
 ['What relationship does composition express here?',['StudyPlanner is a Budget subclass','StudyPlanner has and uses a budget and recorder','All objects share identical state'],1,'Composition connects collaborators by holding references to them.'],
 ['Does a failed recorder automatically undo an earlier budget update?', ['No','Always','Only for integers'],0,'Sequential method calls are not a transaction.'],
 ['Does alias = first copy the instance?', ['Yes, recursively','Yes, but only its attributes','No'],2,'Both names refer to the same object.'],
 ['When can a function plus a dictionary still be a good design?', ['Never after learning classes','When persistent object behavior does not add useful clarity','Only for invalid inputs'],1,'A class should serve a responsibility rather than add ceremony.'],
];
export const classQuestions=checks.map(([question,options,correct,explanation],i)=>({id:i+1,question,options:options.map((text,index)=>({text,isCorrect:index===correct,explanation}))}));
