"use client";

import { PageHeader } from "@/components/PageHeader";
import { evaluateAll, type Achievement } from "@/lib/achievements";
import { useMuslimState } from "@/lib/useMuslimState";

const CATEGORY_LABEL: Record<Achievement["category"], string> = {
  streak: "Streak",
  salat: "Salat",
  quran: "Al-Quran",
  mihrab: "Mihrab",
  xp: "XP",
};

export function AchievementGrid() {
  const { progress, quests, hydrated } = useMuslimState();
  const evaluated = evaluateAll(progress, quests);
  const unlocked = evaluated.filter((a) => a.unlocked).length;
  const total = evaluated.length;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Achievement"
        title="Pencapaianmu"
        description={`Kumpulkan badge sebagai milestone perjalananmu. ${unlocked} dari ${total} terbuka.`}
      />

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            Semua Badge
          </h2>
          <div className="text-sm text-emerald-700/70 dark:text-parchment-100/60">
            {unlocked} / {total}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {evaluated.map(({ def, current, target, unlocked }) => {
            const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            return (
              <article
                key={def.id}
                className={`min-w-0 rounded-2xl border p-4 transition ${
                  unlocked
                    ? "border-amber-400/50 bg-amber-400/5 shadow-glow-amber"
                    : "border-emerald-100 bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-900/60"
                } ${!hydrated ? "opacity-60" : ""}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      unlocked
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950"
                        : "bg-emerald-100 text-emerald-700/40 dark:bg-space-800 dark:text-parchment-100/30"
                    }`}
                  >
                    <TrophyIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h3 className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
                        {def.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-parchment-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:bg-space-800 dark:text-parchment-100/70">
                        {CATEGORY_LABEL[def.category]}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-sm text-emerald-700/80 dark:text-parchment-100/70">
                      {def.description}
                    </p>
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-emerald-100 dark:bg-space-800">
                        <div
                          className={`h-full rounded-full ${
                            unlocked
                              ? "bg-amber-400"
                              : "bg-emerald-500/60 dark:bg-neon-500/50"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
                        {Math.min(current, target)} / {target}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
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
