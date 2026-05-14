"use client";

import { useEffect } from "react";

type Props = {
  /** YYYY-MM-DD of the day a life saved. null = nothing to show. */
  saveDate: string | null;
  onDismiss: () => void;
};

/**
 * One-time toast that fires when a streak life was just consumed to cover a
 * missed day. Mirrors the visual style of AchievementToast but with a
 * shield icon and emerald → space-navy gradient.
 */
export function StreakSaveToast({ saveDate, onDismiss }: Props) {
  useEffect(() => {
    if (!saveDate) return;
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [saveDate, onDismiss]);

  if (!saveDate) return null;

  const [y, m, d] = saveDate.split("-").map(Number);
  const formatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(y, m - 1, d));

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-3 sm:top-6"
    >
      <button
        onClick={onDismiss}
        className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-neon-400/60 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 px-4 py-3 text-left shadow-glow ring-1 ring-neon-400/40 backdrop-blur transition hover:scale-[1.01]"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-500 to-emerald-600 text-emerald-950 shadow-glow">
          <ShieldIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-neon-400">
            Streak Diselamatkan
          </div>
          <div className="truncate font-display text-base font-bold text-parchment-50">
            Nyawa terpakai untuk {formatted}
          </div>
          <div className="truncate text-xs text-parchment-100/70">
            Terus jaga rutinmu — nyawa baru tiap 7 hari streak.
          </div>
        </div>
        <span className="hidden shrink-0 text-xs text-parchment-100/60 sm:block">
          Tutup
        </span>
      </button>
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
