/**
 * Mihrab theme module — PRD §1.3
 *
 * Bridge mode: writes both the new `data-theme` attribute (PRD-canonical)
 * AND the legacy `.dark` class so existing components and `ThemeToggle`
 * keep working unmodified during the Phase 2 → Phase 3+ migration.
 *
 * Storage:
 *   - mihrab-theme  (PRD canonical key)
 *   - mt:theme      (legacy key still consumed by ThemeToggle.tsx)
 *
 * Both keys are dual-written by setTheme(). getTheme() reads the canonical
 * key first, falls back to legacy, then defaults to "dark".
 *
 * SSR-safe: every public function guards on typeof window === "undefined".
 */

export type Theme = "dark" | "light";

export const THEME_KEY = "mihrab-theme";
export const LEGACY_THEME_KEY = "mt:theme";

function isTheme(v: unknown): v is Theme {
  return v === "dark" || v === "light";
}

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const fresh = window.localStorage.getItem(THEME_KEY);
    if (isTheme(fresh)) return fresh;
    const legacy = window.localStorage.getItem(LEGACY_THEME_KEY);
    if (isTheme(legacy)) return legacy;
  } catch {
    // localStorage may throw in private mode / strict storage policies
  }
  return "dark";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(LEGACY_THEME_KEY, theme);
  } catch {
    // ignore storage failures; we still apply the visual theme below
  }
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
}

export function initTheme(): void {
  if (typeof window === "undefined") return;
  const theme = getTheme();
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
}
