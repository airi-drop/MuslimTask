"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  DAILY_QUESTS,
  WEEKLY_QUESTS,
  applyQuestState,
  getQuestState,
  loadQuests,
  saveQuests,
  type QuestDef,
  type QuestState,
  type QuestStore,
} from "@/lib/quests";
import { loadProgress, saveProgress, type Progress, EMPTY_PROGRESS } from "@/lib/progress";

type Tab = "daily" | "weekly";

export function QuestBoard() {
  const [tab, setTab] = useState<Tab>("daily");
  const [store, setStore] = useState<QuestStore>({ daily: {}, weekly: {} });
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadQuests());
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  const activeList = tab === "daily" ? DAILY_QUESTS : WEEKLY_QUESTS;

  const stats = useMemo(() => {
    const daily = DAILY_QUESTS.map((q) => getQuestState(store, q));
    const weekly = WEEKLY_QUESTS.map((q) => getQuestState(store, q));
    const dailyDone = daily.filter((s) => s.done).length;
    const weeklyDone = weekly.filter((s) => s.done).length;
    const dailyXp = DAILY_QUESTS.reduce(
      (acc, q) => acc + (daily.find((s) => s.id === q.id)?.done ? q.xp : 0),
      0,
    );
    const weeklyXp = WEEKLY_QUESTS.reduce(
      (acc, q) => acc + (weekly.find((s) => s.id === q.id)?.done ? q.xp : 0),
      0,
    );
    return { dailyDone, weeklyDone, dailyXp, weeklyXp };
  }, [store]);

  function increment(def: QuestDef) {
    const current = getQuestState(store, def);
    if (current.done) return;
    const nextCount = Math.min(def.target, current.count + 1);
    const justDone = nextCount >= def.target;
    const next: QuestState = {
      ...current,
      count: nextCount,
      done: justDone,
      claimedAt: justDone ? new Date().toISOString() : current.claimedAt,
    };
    const nextStore = applyQuestState(store, def, next);
    setStore(nextStore);
    saveQuests(nextStore);

    if (justDone) {
      const nextProgress: Progress = {
        ...progress,
        totalXp: progress.totalXp + def.xp,
        todayXp: progress.todayXp + def.xp,
      };
      setProgress(nextProgress);
      saveProgress(nextProgress);
    }
  }

  function reset(def: QuestDef) {
    const current = getQuestState(store, def);
    const wasDone = current.done;
    const next: QuestState = {
      ...current,
      count: 0,
      done: false,
      claimedAt: undefined,
    };
    const nextStore = applyQuestState(store, def, next);
    setStore(nextStore);
    saveQuests(nextStore);
    if (wasDone) {
      // Reverse the XP grant so totals stay consistent.
      const nextProgress: Progress = {
        ...progress,
        totalXp: Math.max(0, progress.totalXp - def.xp),
        todayXp: Math.max(0, progress.todayXp - def.xp),
      };
      setProgress(nextProgress);
      saveProgress(nextProgress);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Quest"
        title="Papan Quest"
        description="Selesaikan misi harian & mingguan. Setiap quest selesai memberi XP — naikkan level, kumpulkan badge, jaga streak."
      />

      {/* Summary */}
      <section className="grid gap-3 sm:grid-cols-2">
        <SummaryTile
          tab="daily"
          active={tab === "daily"}
          onClick={() => setTab("daily")}
          done={stats.dailyDone}
          total={DAILY_QUESTS.length}
          xp={stats.dailyXp}
        />
        <SummaryTile
          tab="weekly"
          active={tab === "weekly"}
          onClick={() => setTab("weekly")}
          done={stats.weeklyDone}
          total={WEEKLY_QUESTS.length}
          xp={stats.weeklyXp}
        />
      </section>

      <section className="space-y-3">
        {activeList.map((q) => {
          const s = getQuestState(store, q);
          return (
            <QuestRow
              key={q.id}
              def={q}
              state={s}
              disabled={!hydrated}
              onIncrement={() => increment(q)}
              onReset={() => reset(q)}
            />
          );
        })}
      </section>
    </div>
  );
}

function SummaryTile({
  tab,
  active,
  onClick,
  done,
  total,
  xp,
}: {
  tab: Tab;
  active: boolean;
  onClick: () => void;
  done: number;
  total: number;
  xp: number;
}) {
  const pct = Math.round((done / total) * 100);
  return (
    <button
      onClick={onClick}
      className={`card hud-frame relative min-w-0 overflow-hidden p-5 text-left transition sm:p-6 ${
        active
          ? "ring-2 ring-neon-400 shadow-glow"
          : "hover:-translate-y-0.5 hover:shadow-glow"
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-400/10 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-neon-500/80">
          {tab === "daily" ? "Harian" : "Mingguan"}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/60 dark:text-parchment-100/60">
          {tab === "daily" ? "reset 00:00" : "reset Senin"}
        </span>
      </div>
      <h2 className="mt-1 font-display text-xl font-bold text-emerald-800 dark:text-parchment-50 sm:text-2xl">
        {tab === "daily" ? "Quest Harian" : "Quest Mingguan"}
      </h2>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-emerald-800 dark:text-parchment-50">
          {done}
          <span className="text-xl text-emerald-700/60 dark:text-parchment-100/60">/{total}</span>
        </span>
        <span className="text-glow-amber font-display text-base font-bold">
          +{xp} XP
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-neon-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
}

function QuestRow({
  def,
  state,
  onIncrement,
  onReset,
  disabled,
}: {
  def: QuestDef;
  state: QuestState;
  onIncrement: () => void;
  onReset: () => void;
  disabled?: boolean;
}) {
  const pct = Math.round((state.count / def.target) * 100);
  const Icon = ICONS[def.category];
  return (
    <article
      className={`card relative min-w-0 overflow-hidden p-4 transition sm:p-5 ${
        state.done ? "ring-1 ring-neon-400/50 shadow-glow" : ""
      }`}
    >
      <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-emerald-700 ${
            state.done
              ? "bg-gradient-to-br from-neon-500 to-emerald-600 text-emerald-950 shadow-glow"
              : "bg-emerald-100 dark:bg-emerald-900/60 dark:text-neon-400"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
              {def.title}
            </h3>
            <span className="shrink-0 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-300">
              +{def.xp} XP
            </span>
            {state.done && (
              <span className="shrink-0 rounded-full bg-neon-400/15 px-2 py-0.5 text-[11px] font-bold text-neon-600 dark:text-neon-400">
                ✓ Klaim
              </span>
            )}
          </div>
          <p className="mt-1 break-words text-sm text-emerald-700/80 dark:text-parchment-100/70">
            {def.description}
          </p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900">
              <div
                className={`h-full rounded-full transition-all ${
                  state.done
                    ? "bg-gradient-to-r from-neon-500 to-neon-400"
                    : "bg-emerald-500/70 dark:bg-emerald-600"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
              {state.count}/{def.target}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:flex-col">
          {state.done ? (
            <button
              onClick={onReset}
              disabled={disabled}
              className="flex-1 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900 sm:flex-none"
            >
              Batal
            </button>
          ) : (
            <button
              onClick={onIncrement}
              disabled={disabled}
              className="flex-1 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-2 text-sm font-semibold text-parchment-50 shadow-glow ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-60 sm:flex-none"
            >
              {def.target > 1 ? "+1" : "Klaim"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------- Category icons ---------- */

const ICONS: Record<string, (p: { className?: string }) => React.JSX.Element> = {
  salat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V12c0-3 3-5 8-5s8 2 8 5v9" />
      <path d="M4 21h16M10 21v-4a2 2 0 0 1 4 0v4" />
    </svg>
  ),
  quran: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z" />
      <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4Z" />
    </svg>
  ),
  dzikir: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="6" r="2" />
      <circle cx="6" cy="10" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="5" cy="16" r="2" />
      <circle cx="19" cy="16" r="2" />
    </svg>
  ),
  puasa: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  sedekah: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
      <path d="M12 7v10M9 9h4.5a1.5 1.5 0 1 1 0 3H10a1.5 1.5 0 1 0 0 3h5" />
    </svg>
  ),
  sunnah: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 3 7 7 .8-5.2 4.7L18.5 22 12 18l-6.5 4 1.7-7.5L2 9.8 9 9l3-7Z" />
    </svg>
  ),
};
