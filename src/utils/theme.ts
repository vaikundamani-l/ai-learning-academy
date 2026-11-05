import type { ThemeMode } from '../types/theme';

export const THEME_STORAGE_KEY = 'ai_master_course_theme';

export function isValidTheme(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** Determine whether light or dark mode should be applied based on preference and OS setting. */
export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): 'dark' | 'light' {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return systemPrefersDark ? 'dark' : 'light';
}

/** Retrieve persisted theme or default to 'system'. */
export function getStoredTheme(storage?: Storage): ThemeMode {
  try {
    const s = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    const item = s?.getItem(THEME_STORAGE_KEY);
    if (isValidTheme(item)) return item;
  } catch {
    // Ignore storage failures
  }
  return 'system';
}

/** Persist selected theme setting. */
export function setStoredTheme(theme: ThemeMode, storage?: Storage): void {
  try {
    const s = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    s?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures
  }
}

/** Apply class and style to document element. */
export function applyThemeToDocument(resolved: 'dark' | 'light', doc?: Document): void {
  if (typeof document === 'undefined' && !doc) return;
  const d = doc ?? document;
  const root = d.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }
}
