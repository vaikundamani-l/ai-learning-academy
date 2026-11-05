import test from 'node:test';
import assert from 'node:assert/strict';
import { cpuAtCycle } from '../src/utils/cpu.ts';
import { isUserProgress } from '../src/utils/progress.ts';
import { 
  isValidTheme, 
  resolveTheme, 
  getStoredTheme, 
  setStoredTheme, 
  applyThemeToDocument,
  THEME_STORAGE_KEY 
} from '../src/utils/theme.ts';

const backup = { startedStages: [], completedStages: [], completedLessons: [], completedExercises: [], completedProjects: [], bookmarks: [], notes: {}, assessmentScores: {}, lastActiveStageId: 0 };
test('valid progress backup round trips', () => assert.equal(isUserProgress(JSON.parse(JSON.stringify(backup))), true));
test('partial or malformed imports cannot replace progress', () => {
  for (const bad of [null, [], { startedStages: [] }, { ...backup, notes: null }, { ...backup, completedStages: [31] }, { ...backup, assessmentScores: { quiz: 101 } }, { ...backup, bookmarks: ['//example.org'] }, { ...backup, notes: { x: 42 } }]) {
    assert.equal(isUserProgress(bad), false);
  }
});
test('CPU loads memory, adds, subtracts, and stores in the correct phases', () => {
  assert.equal(cpuAtCycle(4).registers.R1, 5);
  assert.equal(cpuAtCycle(5).registers.R1, 9);
  assert.equal(cpuAtCycle(9).registers.R3, 0);
  assert.equal(cpuAtCycle(10).registers.R3, 21);
  assert.equal(cpuAtCycle(15).registers.R4, 12);
  assert.equal(cpuAtCycle(18).memory['0x0C'], 0);
  assert.equal(cpuAtCycle(19).memory['0x0C'], 12);
  assert.equal(cpuAtCycle(20).halted, true);
});
test('CPU replay supports rewind and clean reset without stale state', () => {
  cpuAtCycle(20);
  assert.equal(cpuAtCycle(18).memory['0x0C'], 0);
  assert.deepEqual(cpuAtCycle(0).registers, { R1: 5, R2: 12, R3: 0, R4: 0 });
  assert.equal(cpuAtCycle(1).phase, 'FETCH');
  assert.equal(cpuAtCycle(6).instruction, 'ADD R3, R1, R2');
});

// Theme Unit Tests
test('theme validator recognizes valid themes and rejects arbitrary strings', () => {
  assert.equal(isValidTheme('light'), true);
  assert.equal(isValidTheme('dark'), true);
  assert.equal(isValidTheme('system'), true);
  assert.equal(isValidTheme('blue'), false);
  assert.equal(isValidTheme(null), false);
  assert.equal(isValidTheme(undefined), false);
  assert.equal(isValidTheme(123), false);
});

test('resolveTheme properly maps explicit and system preferences', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('dark', true), 'dark');
  assert.equal(resolveTheme('light', false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('system', true), 'dark');
  assert.equal(resolveTheme('system', false), 'light');
});

test('theme persistence stores and retrieves valid settings with fallback', () => {
  const store = new Map();
  const mockStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i],
    get length() { return store.size; }
  };

  assert.equal(getStoredTheme(mockStorage), 'system');
  setStoredTheme('light', mockStorage);
  assert.equal(getStoredTheme(mockStorage), 'light');
  setStoredTheme('dark', mockStorage);
  assert.equal(getStoredTheme(mockStorage), 'dark');
  mockStorage.setItem(THEME_STORAGE_KEY, 'corrupted');
  assert.equal(getStoredTheme(mockStorage), 'system');
});

test('applyThemeToDocument toggles classes and sets colorScheme style', () => {
  const classes = new Set();
  const mockDoc = {
    documentElement: {
      classList: {
        add: (cls) => classes.add(cls),
        remove: (cls) => classes.delete(cls),
        contains: (cls) => classes.has(cls)
      },
      style: { colorScheme: '' }
    }
  };

  applyThemeToDocument('dark', mockDoc);
  assert.equal(classes.has('dark'), true);
  assert.equal(classes.has('light'), false);
  assert.equal(mockDoc.documentElement.style.colorScheme, 'dark');

  applyThemeToDocument('light', mockDoc);
  assert.equal(classes.has('dark'), false);
  assert.equal(classes.has('light'), true);
  assert.equal(mockDoc.documentElement.style.colorScheme, 'light');
});
