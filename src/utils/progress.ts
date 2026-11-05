import type { UserProgress } from '../types/curriculum';

const recordOf = (value: unknown, predicate: (v: unknown) => boolean) =>
  !!value && typeof value === 'object' && !Array.isArray(value) &&
  Object.entries(value).every(([key, entry]) => !['__proto__', 'constructor', 'prototype'].includes(key) && predicate(entry));
const stageId = (v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) <= 30;
const strings = (v: unknown) => Array.isArray(v) && v.every(x => typeof x === 'string');

/** Validate the entire backup before replacing any learner data. */
export function isUserProgress(value: unknown): value is UserProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  return ['startedStages', 'completedStages', 'completedProjects'].every(key =>
    Array.isArray(p[key]) && (p[key] as unknown[]).every(stageId)) &&
    strings(p.completedLessons) && strings(p.completedExercises) &&
    strings(p.bookmarks) && (p.bookmarks as string[]).every(path => path.startsWith('/') && !path.startsWith('//')) &&
    recordOf(p.notes, v => typeof v === 'string') &&
    recordOf(p.assessmentScores, v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100) &&
    stageId(p.lastActiveStageId);
}
