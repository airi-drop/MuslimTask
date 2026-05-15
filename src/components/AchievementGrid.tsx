"use client";

import { PageHeader } from "@/components/PageHeader";
import { evaluateAll, type Achievement } from "@/lib/achievements";
import { useMuslimState } from "@/lib/useMuslimState";
import { useT, type TKey, tAchievement } from "@/lib/i18n";

const CATEGORY_KEY: Record<Achievement["category"], TKey> = {
  streak: "achievement.cat.streak",
  salat: "achievement.cat.salat",
  quran: "achievement.cat.quran",
  mihrab: "achievement.cat.mihrab",
  xp: "achievement.cat.xp",
};

export function AchievementGrid() {
  const { t, lang } = useT();
  const { progress, quests, hydrated, claimAchievement } = useMuslimState();
  const evaluated = evaluateAll(progress, quests);
  const unlocked = evaluated.filter((a) => a.unlocked).length;
  const total = evaluated.length;

  const seenSet = new Set(progress.seenAchievements);
  const unclaimedIds = evaluated
    .filter((a) => a.unlocked && !seenSet.has(a.def.id))
    .map((a) => a.def.id);

  function claimAll() {
    claimAchievement(unclaimedIds);
  }

  function claimSingle(id: string) {
    claimAchievement([id]);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow={t("achievement.eyebrow")}
        title={t("achievement.title")}
        description={`${t("achievement.description")} ${unlocked} / ${total}`}
        back={{ href: "/", label: "Dashboard" }}
      />

      {/* Claim all button */}
      {unclaimedIds.length > 0 && (
        <div className="card flex items-center justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">
              {unclaimedIds.length} {t("achievement.newBadges")}
            </p>
            <p className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
              {t("achievement.claimHint")}
            </p>
          </div>
          <button
            onClick={claimAll}
            className="shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 px-4 py-2 text-sm font-bold text-emerald-950 shadow-glow-amber transition hover:from-amber-300 hover:to-amber-500"
          >
            {t("achievement.claimAll")}
          </button>
        </div>
      )}

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            {t("achievement.allBadges")}
          </h2>
          <div className="text-sm text-emerald-700/70 dark:text-parchment-100/60">
            {unlocked} / {total}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {evaluated.map(({ def, current, target, unlocked: isUnlocked }) => {
            const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            const isClaimed = seenSet.has(def.id);
            const canClaim = isUnlocked && !isClaimed;
            const ai = tAchievement(def.id, lang);

            return (
              <article
                key={def.id}
                className={`min-w-0 rounded-2xl border p-4 transition ${
                  isUnlocked
                    ? canClaim
                      ? "border-amber-400/70 bg-amber-400/10 shadow-glow-amber ring-1 ring-amber-400/30"
                      : "border-amber-400/50 bg-amber-400/5"
                    : "border-emerald-100 bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-900/60"
                } ${!hydrated ? "opacity-60" : ""}`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                      isUnlocked
                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950"
                        : "bg-emerald-100 text-emerald-700/40 dark:bg-space-800 dark:text-parchment-100/30"
                    }`}
                  >
                    <TrophyIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <h3 className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
                        {ai?.title ?? def.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-parchment-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:bg-space-800 dark:text-parchment-100/70">
                        {t(CATEGORY_KEY[def.category])}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-sm text-emerald-700/80 dark:text-parchment-100/70">
                      {ai?.description ?? def.description}
                    </p>
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-emerald-100 dark:bg-space-800">
                        <div
                          className={`h-full rounded-full ${
                            isUnlocked
                              ? "bg-amber-400"
                              : "bg-emerald-500/60 dark:bg-neon-500/50"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
                          {Math.min(current, target)} / {target}
                        </span>
                        {canClaim && (
                          <button
                            onClick={() => claimSingle(def.id)}
                            className="rounded-lg bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-emerald-950 transition hover:bg-amber-300"
                          >
                            {t("achievement.claim")}
                          </button>
                        )}
                        {isUnlocked && isClaimed && (
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            ✓ {t("achievement.claimedLabel")}
                          </span>
                        )}
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
