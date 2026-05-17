"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "mt:installPromptDismissed";
const DISMISS_DAYS = 14;

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Shows a lightweight "Pasang Aplikasi" pill at the bottom-right when the
 * browser fires `beforeinstallprompt`. Suppressed if the app is already
 * installed (display-mode: standalone) or recently dismissed.
 */
export function InstallPrompt() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed?
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS legacy
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (standalone) return;

    // Dismissed recently?
    try {
      const at = window.localStorage.getItem(DISMISS_KEY);
      if (at) {
        const elapsed = Date.now() - Number(at);
        if (elapsed < DISMISS_DAYS * 86_400_000) return;
      }
    } catch {
      /* ignore */
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setHidden(true);
      setEvt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (hidden || !evt) return null;

  async function install() {
    if (!evt) return;
    try {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      if (outcome === "dismissed") {
        try {
          window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
      }
    } finally {
      setEvt(null);
      setHidden(true);
    }
  }

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setHidden(true);
    setEvt(null);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[55] flex justify-center px-3 sm:bottom-6">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-glow ring-1 ring-emerald-100 dark:border-emerald-900/60 dark:bg-space-800 dark:ring-emerald-900/60">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
            <path d="M5 21h14" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm font-bold text-emerald-800 dark:text-parchment-50">
            Pasang Mihrab
          </div>
          <div className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
            Akses lebih cepat dan tetap jalan offline.
          </div>
        </div>
        <button
          onClick={install}
          className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-3 py-2 text-xs font-semibold text-parchment-50 ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700"
        >
          Pasang
        </button>
        <button
          onClick={dismiss}
          aria-label="Tutup"
          className="shrink-0 rounded-full p-1 text-emerald-700/70 hover:bg-parchment-50 dark:text-parchment-100/70 dark:hover:bg-space-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
