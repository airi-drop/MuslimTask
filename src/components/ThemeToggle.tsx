"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "mt:theme";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

/**
 * Inline script that runs before React hydrates — prevents flash of wrong theme.
 * Place once in <head> (via layout).
 */
export const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem("${KEY}");
    if (!t) {
      t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (t === "dark") document.documentElement.classList.add("dark");
  } catch(e){}
})();
`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Theme | null) ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(saved);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(KEY, next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Aktifkan mode ${theme === "dark" ? "terang" : "gelap"}`}
      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-neon-400 ${className}`}
    >
      {mounted && theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
