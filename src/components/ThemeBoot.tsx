"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/theme";

/**
 * Runs `initTheme()` once on mount.
 *
 * The inline `themeBootScript` in <head> already applies the correct
 * data-theme attribute and `.dark` class before hydration to prevent
 * FOUC. This component re-asserts the same state at hydration time as
 * a defensive measure — useful when `theme.ts` is the canonical source
 * of truth and we want to guarantee the React tree and the DOM agree.
 *
 * Renders nothing.
 */
export function ThemeBoot() {
  useEffect(() => {
    initTheme();
  }, []);
  return null;
}
