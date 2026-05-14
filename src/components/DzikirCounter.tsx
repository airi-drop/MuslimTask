"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AchievementToast } from "@/components/AchievementToast";
import { PageHeader } from "@/components/PageHeader";
import {
  DZIKIR_SECTIONS,
  getCount,
  incrementCount,
  isSectionDone,
  loadDzikir,
  resetSet,
  saveDzikir,
  sectionProgress,
  setCount,
  type DzikirCounters,
  type DzikirItem,
  type DzikirSection,
  type DzikirSet,
} from "@/lib/dzikir";
import { addQuestXp } from "@/lib/progress";
import {
  applyQuestState,
  DAILY_QUESTS,
  getQuestState,
} from "@/lib/quests";
import { useMuslimState } from "@/lib/useMuslimState";

const DZIKIR_PAGI_DEF = DAILY_QUESTS.find((q) => q.id === "dzikir-pagi")!;
const DZIKIR_PETANG_DEF = DAILY_QUESTS.find((q) => q.id === "dzikir-petang")!;

function vibrate(ms: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignore */
    }
  }
}

export function DzikirCounter() {
  const { quests, setQuests, setProgress, unlockedNow, clearUnlockedNow } =
    useMuslimState();
  const [activeSet, setActiveSet] = useState<DzikirSet>("pagi");
  const [counters, setCounters] = useState<DzikirCounters>(() => loadDzikir());
  const [hydrated, setHydrated] = useState(false);
  const claimedSetsRef = useRef<Set<DzikirSet>>(new Set());

  // Hydrate (storage may have a different shape after midnight reset)
  useEffect(() => {
    setCounters(loadDzikir());
    setHydrated(true);
  }, []);

  const activeSection = useMemo(
    () => DZIKIR_SECTIONS.find((s) => s.set === activeSet)!,
    [activeSet],
  );

  function update(next: DzikirCounters) {
    setCounters(next);
    saveDzikir(next);
  }

  function tap(item: DzikirItem) {
    const result = incrementCount(counters, activeSet, item.id, item.count);
    if (result.value === counters.counters[activeSet]?.[item.id]) return; // already at max
    update(result.next);

    if (result.reachedTarget) {
      vibrate([20, 40, 20]); // double pulse on completion
    } else {
      vibrate(8);
    }

    // Check whether the entire section is now complete → award daily quest XP.
    const sectionDone = isSectionDone(result.next, activeSection);
    if (sectionDone && !claimedSetsRef.current.has(activeSet)) {
      claimedSetsRef.current.add(activeSet);
      maybeClaimQuest(activeSet);
    }
  }

  function maybeClaimQuest(set: DzikirSet) {
    const def =
      set === "pagi"
        ? DZIKIR_PAGI_DEF
        : set === "petang"
          ? DZIKIR_PETANG_DEF
          : null;
    if (!def) return;
    const state = getQuestState(quests, def);
    if (state.done) return;
    const next = {
      ...state,
      count: def.target,
      done: true,
      claimedAt: new Date().toISOString(),
    };
    setQuests((s) => applyQuestState(s, def, next));
    setProgress((p) => addQuestXp(p, def.xp));
  }

  function bumpDown(item: DzikirItem) {
    const cur = getCount(counters, activeSet, item.id);
    if (cur === 0) return;
    update(setCount(counters, activeSet, item.id, cur - 1));
  }

  function resetActive() {
    update(resetSet(counters, activeSet));
    claimedSetsRef.current.delete(activeSet);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <AchievementToast ids={unlockedNow} onDismiss={clearUnlockedNow} />

      <PageHeader
        eyebrow="Mihrab / Dzikir"
        title="Dzikir Harian"
        description="Wirid pagi, petang, dan setelah salat. Tap kartu untuk menghitung — counter tersimpan otomatis dan ter-reset tiap hari."
        back={{ href: "/mihrab", label: "Mihrab" }}
      />

      {/* Tabs */}
      <section className="grid gap-2 sm:grid-cols-3">
        {DZIKIR_SECTIONS.map((s) => {
          const active = s.set === activeSet;
          const { done, total } = sectionProgress(counters, s);
          const sectionComplete = done === total;
          return (
            <button
              key={s.set}
              onClick={() => setActiveSet(s.set)}
              className={`card relative min-w-0 overflow-hidden p-4 text-left transition ${
                active
                  ? "ring-2 ring-neon-400 shadow-glow"
                  : "hover:-translate-y-0.5 hover:shadow-glow"
              }`}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-neon-400/10 blur-2xl" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-neon-500/80">
                  {s.set === "pagi" ? "Pagi" : s.set === "petang" ? "Petang" : "Setelah Salat"}
                </span>
                {sectionComplete && (
                  <span className="rounded-full bg-neon-400/15 px-2 py-0.5 text-[10px] font-bold text-neon-600 dark:text-neon-400">
                    ✓ Selesai
                  </span>
                )}
              </div>
              <div className="mt-1 truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
                {s.title}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-neon-400 transition-all"
                    style={{
                      width: `${total > 0 ? (done / total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="shrink-0 text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
                  {done}/{total}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Description + reset */}
      <section className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="min-w-0 flex-1 text-sm text-emerald-700/80 dark:text-parchment-100/70">
          {activeSection.description}
        </p>
        <button
          onClick={resetActive}
          disabled={!hydrated}
          className="shrink-0 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-parchment-50 disabled:opacity-60 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900"
        >
          Reset Set Ini
        </button>
      </section>

      {/* Items */}
      <section className="space-y-3">
        {activeSection.items.map((item, idx) => {
          const count = getCount(counters, activeSet, item.id);
          const done = count >= item.count;
          const pct = Math.min(100, (count / item.count) * 100);
          return (
            <article
              key={item.id}
              className={`card relative min-w-0 overflow-hidden transition ${
                done ? "ring-1 ring-neon-400/50 shadow-glow" : ""
              }`}
            >
              <button
                onClick={() => tap(item)}
                disabled={!hydrated || done}
                className={`block w-full p-5 text-left transition ${
                  done
                    ? "cursor-default"
                    : "hover:bg-parchment-50/50 active:scale-[0.99] dark:hover:bg-space-900/40"
                } sm:p-6`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold transition ${
                        done
                          ? "bg-gradient-to-br from-neon-500 to-emerald-600 text-emerald-950 shadow-glow"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="text-sm font-semibold text-emerald-700/80 dark:text-parchment-100/70">
                      Dibaca {item.count}x
                    </div>
                  </div>

                  {/* Counter pill */}
                  <div
                    className={`flex shrink-0 items-baseline gap-1 rounded-2xl border px-4 py-2 transition ${
                      done
                        ? "border-neon-400/60 bg-neon-400/15"
                        : "border-emerald-100 bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-900"
                    }`}
                  >
                    <span
                      className={`font-display text-2xl font-bold leading-none ${
                        done
                          ? "text-glow-neon"
                          : "text-emerald-800 dark:text-parchment-50"
                      }`}
                    >
                      {count}
                    </span>
                    <span className="text-xs text-emerald-700/60 dark:text-parchment-100/50">
                      / {item.count}
                    </span>
                  </div>
                </div>

                <p
                  className="arabic mt-4 break-words text-right text-2xl leading-loose text-emerald-700 dark:text-parchment-50 sm:text-3xl"
                  dir="rtl"
                >
                  {item.arabic}
                </p>
                <p className="mt-3 break-words text-sm italic text-emerald-700/80 dark:text-parchment-100/70">
                  {item.latin}
                </p>
                <p className="mt-2 break-words text-sm text-emerald-800 dark:text-parchment-100/90">
                  <span className="font-semibold">Artinya:</span>{" "}
                  {item.translation}
                </p>
                {item.source && (
                  <p className="mt-2 text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
                    {item.source}
                  </p>
                )}

                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900">
                  <div
                    className={`h-full rounded-full transition-all ${
                      done
                        ? "bg-gradient-to-r from-neon-500 to-neon-400"
                        : "bg-emerald-500/70 dark:bg-emerald-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${
                      done
                        ? "text-neon-600 dark:text-neon-400"
                        : "text-emerald-700/70 dark:text-parchment-100/60"
                    }`}
                  >
                    {done
                      ? "✓ Selesai"
                      : "Tap di mana saja kartu untuk +1"}
                  </span>
                  {count > 0 && !done && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        bumpDown(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          bumpDown(item);
                        }
                      }}
                      className="cursor-pointer rounded-full border border-emerald-100 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900"
                    >
                      −1
                    </span>
                  )}
                </div>
              </button>
            </article>
          );
        })}
      </section>

      {/* Footer hint */}
      <p className="text-center text-xs text-emerald-700/60 dark:text-parchment-100/50">
        Counter ter-reset otomatis tengah malam.
      </p>
    </div>
  );
}
