"use client";

import { useEffect } from "react";
import { ACHIEVEMENTS } from "@/lib/achievements";

type Props = {
  ids: string[];
  onDismiss: () => void;
};

/**
 * Stacked toast for newly-unlocked achievements. Auto-dismisses each toast
 * after 5 seconds, but the user can also tap to dismiss all immediately.
 */
export function AchievementToast({ ids, onDismiss }: Props) {
  useEffect(() => {
    if (ids.length === 0) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [ids, onDismiss]);

  if (ids.length === 0) return null;

  const items = ids
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-3 sm:top-6"
    >
      {items.map((a) => (
        <button
          key={a.id}
          onClick={onDismiss}
          className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-amber-300/70 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 px-4 py-3 text-left shadow-glow-amber ring-1 ring-amber-400/40 backdrop-blur transition hover:scale-[1.01]"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 shadow-glow-amber">
            <TrophyIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300">
              Achievement Unlocked
            </div>
            <div className="truncate font-display text-base font-bold text-parchment-50">
              {a.name}
            </div>
            <div className="truncate text-xs text-parchment-100/70">
              {a.description}
            </div>
          </div>
          <span className="hidden shrink-0 text-xs text-parchment-100/60 sm:block">
            Tutup
          </span>
        </button>
      ))}
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3" />
    </svg>
  );
}
