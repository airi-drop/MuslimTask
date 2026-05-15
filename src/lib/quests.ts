import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";
import { todayKey } from "./progress";

export type QuestKind = "daily" | "weekly";
export type QuestCategory = "salat" | "quran" | "dzikir" | "puasa" | "sedekah" | "sunnah";

export type QuestDef = {
  id: string;
  kind: QuestKind;
  category: QuestCategory;
  title: string;
  description: string;
  /** XP awarded once on completion. */
  xp: number;
  /** Target count to reach completion. 1 = single check. */
  target: number;
};

/**
 * Each quest's runtime state — current count + claimed/done flags
 * + the period key (date for daily, ISO week for weekly) so it auto-resets.
 */
export type QuestState = {
  id: string;
  count: number;
  done: boolean;
  claimedAt?: string;
  periodKey: string;
};

export type QuestStore = {
  daily: Record<string, QuestState>;
  weekly: Record<string, QuestState>;
  /**
   * Per-quest completion history: questId -> sorted list of YYYY-MM-DD dates
   * where the quest was completed. Used by achievements engine for real
   * consecutive-day streak detection.
   */
  completionHistory: Record<string, string[]>;
};

/* ---------- Quest catalog ---------- */

export const DAILY_QUESTS: QuestDef[] = [
  {
    id: "salat-5",
    kind: "daily",
    category: "salat",
    title: "Salat 5 Waktu",
    description:
      "Selesaikan kelima salat fardhu hari ini. Tandai di Dashboard.",
    xp: 50,
    target: 5,
  },
  {
    id: "dzikir-pagi",
    kind: "daily",
    category: "dzikir",
    title: "Dzikir Pagi",
    description: "Baca wirid pagi setelah Subuh.",
    xp: 15,
    target: 1,
  },
  {
    id: "dzikir-petang",
    kind: "daily",
    category: "dzikir",
    title: "Dzikir Petang",
    description: "Baca wirid petang sebelum Maghrib.",
    xp: 15,
    target: 1,
  },
  {
    id: "quran-1",
    kind: "daily",
    category: "quran",
    title: "Baca Al-Quran",
    description: "Baca minimal 1 halaman / 5 ayat hari ini.",
    xp: 20,
    target: 1,
  },
  {
    id: "doa-harian",
    kind: "daily",
    category: "sunnah",
    title: "Doa Harian",
    description: "Baca minimal 1 doa di Mihrab > Doa.",
    xp: 5,
    target: 1,
  },
];

export const WEEKLY_QUESTS: QuestDef[] = [
  {
    id: "puasa-senin-kamis",
    kind: "weekly",
    category: "puasa",
    title: "Puasa Senin-Kamis",
    description: "Berpuasa di hari Senin atau Kamis minggu ini.",
    xp: 80,
    target: 1,
  },
  {
    id: "tahajud-3x",
    kind: "weekly",
    category: "sunnah",
    title: "Tahajud 3x",
    description: "Lakukan salat tahajud 3 kali minggu ini.",
    xp: 100,
    target: 3,
  },
  {
    id: "al-kahfi-jumat",
    kind: "weekly",
    category: "quran",
    title: "Al-Kahfi di Jumat",
    description: "Baca surah Al-Kahfi pada hari Jumat.",
    xp: 60,
    target: 1,
  },
  {
    id: "sedekah",
    kind: "weekly",
    category: "sedekah",
    title: "Sedekah",
    description: "Bersedekah minimal 1 kali minggu ini.",
    xp: 50,
    target: 1,
  },
  {
    id: "dhuha-3x",
    kind: "weekly",
    category: "sunnah",
    title: "Salat Dhuha 3x",
    description: "Lakukan salat dhuha 3 kali minggu ini.",
    xp: 70,
    target: 3,
  },
];

/* ---------- Period keys ---------- */

/** ISO week key like "2026-W20". */
export function weekKey(d: Date = new Date()): string {
  // ISO week: Monday-based, week 1 contains Jan 4.
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/* ---------- Store helpers ---------- */

const EMPTY_STORE: QuestStore = { daily: {}, weekly: {}, completionHistory: {} };

export function loadQuests(): QuestStore {
  const raw = readJSON<Partial<QuestStore>>(STORAGE_KEYS.quests, {});
  // Migrate older shapes (no completionHistory)
  return {
    daily: raw.daily ?? {},
    weekly: raw.weekly ?? {},
    completionHistory: raw.completionHistory ?? {},
  };
}

export function saveQuests(s: QuestStore): void {
  writeJSON(STORAGE_KEYS.quests, s);
}

/**
 * Returns a fresh state for a quest, auto-resetting if the period rolled over.
 */
export function getQuestState(store: QuestStore, def: QuestDef, now: Date = new Date()): QuestState {
  const period = def.kind === "daily" ? todayKey(now) : weekKey(now);
  const bucket = def.kind === "daily" ? store.daily : store.weekly;
  const existing = bucket[def.id];
  if (existing && existing.periodKey === period) return existing;
  return { id: def.id, count: 0, done: false, periodKey: period };
}

export function applyQuestState(
  store: QuestStore,
  def: QuestDef,
  next: QuestState,
  now: Date = new Date(),
): QuestStore {
  const bucket = def.kind === "daily" ? "daily" : "weekly";
  const previous = store[bucket][def.id];
  const wasDone = previous?.done === true;
  const isDone = next.done === true;
  const today = todayKey(now);

  // Maintain completionHistory: append today on first transition to done,
  // remove today on transition to not-done (so cancel rolls back the streak).
  const historyForId = store.completionHistory[def.id] ?? [];
  let nextHistory = historyForId;

  if (isDone && !wasDone && !historyForId.includes(today)) {
    nextHistory = [...historyForId, today].sort();
  } else if (!isDone && wasDone && historyForId.includes(today)) {
    nextHistory = historyForId.filter((d) => d !== today);
  }

  return {
    ...store,
    [bucket]: { ...store[bucket], [def.id]: next },
    completionHistory:
      nextHistory === historyForId
        ? store.completionHistory
        : { ...store.completionHistory, [def.id]: nextHistory },
  };
}

/**
 * Compute the trailing consecutive-day streak for a quest's completion history.
 * Counts back from today (or from the most recent completion if today isn't
 * yet completed — so a streak in progress isn't broken until midnight).
 */
export function consecutiveDayStreak(
  history: string[],
  now: Date = new Date(),
): number {
  if (!history || history.length === 0) return 0;
  const set = new Set(history);
  const todayK = todayKey(now);

  let cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  // If today isn't in history, start from yesterday so an in-progress day
  // doesn't break the trailing streak.
  if (!set.has(todayK)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 1000; i++) {
    const k = todayKey(cursor);
    if (set.has(k)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
