import type { Progress } from "./progress";
import { TARGET_PRAYERS_PER_DAY, todayKey } from "./progress";
import type { QuestStore } from "./quests";

export type AchievementCategory = "streak" | "salat" | "quran" | "mihrab" | "xp";

export type Achievement = {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  /**
   * Returns the current numeric progress and the target to evaluate against.
   * "Unlocked" iff current >= target (and target > 0).
   */
  evaluate: (p: Progress, q: QuestStore, now?: Date) => {
    current: number;
    target: number;
  };
};

/* ---------- Helpers ---------- */

function countSubuhStreak(p: Progress, now: Date = new Date()): number {
  // Count consecutive days ending at today (or yesterday if today incomplete)
  // where "fajr" was marked.
  let cursor = new Date(now);
  const todayK = todayKey(now);
  const today = p.history[todayK];
  if (!today || !today.prayers.includes("fajr")) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let n = 0;
  for (let i = 0; i < 365; i++) {
    const k = todayKey(cursor);
    const rec = p.history[k];
    if (rec && rec.prayers.includes("fajr")) {
      n += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return n;
}

function countPerfectDays(p: Progress): number {
  let n = 0;
  for (const k of Object.keys(p.history)) {
    if (p.history[k].prayers.length >= TARGET_PRAYERS_PER_DAY) n += 1;
  }
  return n;
}

function questCompletedToday(q: QuestStore, id: string): number {
  const s = q.daily[id];
  return s && s.done ? 1 : 0;
}

function quranReadDayStreak(p: Progress, q: QuestStore, now: Date): number {
  // Counts how many consecutive days "quran-1" daily quest was done.
  // We only have the *current* state in QuestStore (no per-day history for
  // quests yet), so we can only guarantee a streak of 0 or 1 from quests
  // alone. Fallback: if today's quest is done, return 1 — full multi-day
  // tracking will be added when quest-history is implemented.
  void p;
  void now;
  return q.daily["quran-1"]?.done ? 1 : 0;
}

/* ---------- Catalog ---------- */

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Langkah Pertama",
    description: "Tandai 1 salat di Dashboard.",
    category: "salat",
    evaluate: (p) => {
      const totalPrayers = Object.values(p.history).reduce(
        (acc, rec) => acc + rec.prayers.length,
        0,
      );
      return { current: Math.min(totalPrayers, 1), target: 1 };
    },
  },
  {
    id: "perfect-day",
    name: "Hari Sempurna",
    description: "Selesaikan 5 salat dalam 1 hari.",
    category: "salat",
    evaluate: (p) => ({
      current: Math.min(countPerfectDays(p), 1),
      target: 1,
    }),
  },
  {
    id: "perfect-week",
    name: "Pekan Sempurna",
    description: "7 hari sempurna kumulatif.",
    category: "salat",
    evaluate: (p) => ({
      current: Math.min(countPerfectDays(p), 7),
      target: 7,
    }),
  },
  {
    id: "subuh-warrior",
    name: "Subuh Warrior",
    description: "Salat Subuh 7 hari berturut-turut.",
    category: "streak",
    evaluate: (p) => ({
      current: Math.min(countSubuhStreak(p), 7),
      target: 7,
    }),
  },
  {
    id: "streak-7",
    name: "Streak 7 Hari",
    description: "Pertahankan streak 7 hari.",
    category: "streak",
    evaluate: (p) => ({ current: Math.min(p.bestStreak, 7), target: 7 }),
  },
  {
    id: "streak-30",
    name: "Streak 30 Hari",
    description: "Pertahankan streak 30 hari.",
    category: "streak",
    evaluate: (p) => ({ current: Math.min(p.bestStreak, 30), target: 30 }),
  },
  {
    id: "streak-100",
    name: "Streak 100 Hari",
    description: "Pertahankan streak 100 hari.",
    category: "streak",
    evaluate: (p) => ({ current: Math.min(p.bestStreak, 100), target: 100 }),
  },
  {
    id: "xp-500",
    name: "Pengumpul XP",
    description: "Kumpulkan 500 XP total.",
    category: "xp",
    evaluate: (p) => ({ current: Math.min(p.totalXp, 500), target: 500 }),
  },
  {
    id: "xp-1000",
    name: "Penjelajah Spiritual",
    description: "Kumpulkan 1.000 XP total.",
    category: "xp",
    evaluate: (p) => ({ current: Math.min(p.totalXp, 1000), target: 1000 }),
  },
  {
    id: "quran-reader",
    name: "Pembaca Al-Quran",
    description: "Baca Al-Quran 7 hari berturut-turut.",
    category: "quran",
    evaluate: (p, q, now = new Date()) => ({
      current: Math.min(quranReadDayStreak(p, q, now), 7),
      target: 7,
    }),
  },
  {
    id: "dzikir-pagi-streak",
    name: "Pagi Berkah",
    description: "Dzikir pagi minggu ini.",
    category: "mihrab",
    evaluate: (_p, q) => ({
      current: questCompletedToday(q, "dzikir-pagi"),
      target: 1,
    }),
  },
  {
    id: "dzikir-petang-streak",
    name: "Petang Berkah",
    description: "Dzikir petang minggu ini.",
    category: "mihrab",
    evaluate: (_p, q) => ({
      current: questCompletedToday(q, "dzikir-petang"),
      target: 1,
    }),
  },
];

/* ---------- Evaluation ---------- */

export type EvaluatedAchievement = {
  def: Achievement;
  current: number;
  target: number;
  unlocked: boolean;
  /** True if this achievement transitioned from locked → unlocked just now. */
  justUnlocked?: boolean;
};

export function evaluateAll(
  p: Progress,
  q: QuestStore,
  now: Date = new Date(),
): EvaluatedAchievement[] {
  const set = new Set(p.unlockedAchievements);
  return ACHIEVEMENTS.map((def) => {
    const { current, target } = def.evaluate(p, q, now);
    const wasUnlocked = set.has(def.id);
    const meetsCondition = target > 0 && current >= target;
    return {
      def,
      current,
      target,
      unlocked: wasUnlocked || meetsCondition,
      justUnlocked: meetsCondition && !wasUnlocked,
    };
  });
}

/** Return the IDs of achievements that just transitioned to unlocked. */
export function newlyUnlocked(
  p: Progress,
  q: QuestStore,
  now: Date = new Date(),
): string[] {
  return evaluateAll(p, q, now)
    .filter((e) => e.justUnlocked)
    .map((e) => e.def.id);
}
