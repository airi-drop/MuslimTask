import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";

/**
 * Per-day record: which obligatory salat were marked done, plus xp earned
 * (split into prayer XP + quest XP so we can recompute deterministically).
 * Date key is local YYYY-MM-DD.
 */
export type DayRecord = {
  date: string;
  /** subset of ["fajr","dhuhr","asr","maghrib","isha"] */
  prayers: string[];
  /** XP from prayer checklist */
  prayerXp: number;
  /** XP from quests claimed on this day */
  questXp: number;
};

export type Progress = {
  streak: number;
  bestStreak: number;
  lives: number; // "Nyawa Streak"
  totalXp: number;
  todayXp: number;
  history: Record<string, DayRecord>;
  /** Achievement IDs that have been unlocked. */
  unlockedAchievements: string[];
  /** Last time we recomputed — used to skip work if same minute. */
  lastRecomputed?: string;
};

export const XP_PER_PRAYER = 10;
export const XP_PER_LEVEL = 100;
export const TARGET_PRAYERS_PER_DAY = 5;

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const EMPTY_PROGRESS: Progress = {
  streak: 0,
  bestStreak: 0,
  lives: 0,
  totalXp: 0,
  todayXp: 0,
  history: {},
  unlockedAchievements: [],
};

/* ---------- Date helpers ---------- */

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Return YYYY-MM-DD that is `offset` days before `d`. */
export function shiftDay(d: Date, offset: number): string {
  const next = new Date(d);
  next.setDate(next.getDate() + offset);
  return todayKey(next);
}

/* ---------- Persistence ---------- */

export function loadProgress(): Progress {
  const p = readJSON<Progress>(STORAGE_KEYS.progress, EMPTY_PROGRESS);
  // Migrate older shapes (from earlier versions where DayRecord.xp existed)
  const migrated: Progress = {
    ...EMPTY_PROGRESS,
    ...p,
    history: p.history ?? {},
    unlockedAchievements: p.unlockedAchievements ?? [],
  };
  for (const key of Object.keys(migrated.history)) {
    const rec = migrated.history[key] as DayRecord & { xp?: number };
    if (typeof rec.prayerXp !== "number" || typeof rec.questXp !== "number") {
      migrated.history[key] = {
        date: rec.date ?? key,
        prayers: rec.prayers ?? [],
        prayerXp:
          typeof rec.prayerXp === "number"
            ? rec.prayerXp
            : (rec.prayers?.length ?? 0) * XP_PER_PRAYER,
        questXp: typeof rec.questXp === "number" ? rec.questXp : 0,
      };
    }
  }
  return migrated;
}

export function saveProgress(p: Progress): void {
  writeJSON(STORAGE_KEYS.progress, p);
}

/* ---------- Derived values ---------- */

export function levelFromXp(xp: number): {
  level: number;
  intoLevel: number;
  toNext: number;
} {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  const toNext = XP_PER_LEVEL - intoLevel;
  return { level, intoLevel, toNext };
}

export function getTodayRecord(p: Progress, date: Date = new Date()): DayRecord {
  const key = todayKey(date);
  return (
    p.history[key] ?? {
      date: key,
      prayers: [],
      prayerXp: 0,
      questXp: 0,
    }
  );
}

export function dayXp(rec: DayRecord): number {
  return rec.prayerXp + rec.questXp;
}

/* ---------- Streak / lives engine ---------- */

/**
 * Compute streak from history alone, looking back from a given date.
 * A "complete" day = all 5 obligatory prayers marked.
 *
 * Lives logic:
 *   - The current streak is broken by the FIRST gap (incomplete + not lived).
 *   - For each gap day, we may "spend" a life if available — capping the
 *     consumption to the lives-pool the user has accumulated.
 *   - Lives are EARNED at every multiple of 7 in the streak (max 3).
 */
export function computeStreakAndLives(
  history: Record<string, DayRecord>,
  now: Date = new Date(),
): { streak: number; bestStreak: number; lives: number } {
  const livesCap = 3;
  // Walk back day by day from yesterday (today is in-progress and shouldn't
  // break a streak even if incomplete).
  let lives = 0;
  // We'll grant lives based on streak length; recompute purely.
  let streak = 0;
  let livesUsed = 0; // how many gaps we've covered

  // First compute streak treating "today" as part of the streak only if complete.
  const todayK = todayKey(now);
  const todayRec = history[todayK];
  const todayComplete =
    todayRec && todayRec.prayers.length >= TARGET_PRAYERS_PER_DAY;

  let cursor = new Date(now);
  if (!todayComplete) {
    // Skip today: streak is what was built up to yesterday.
    cursor.setDate(cursor.getDate() - 1);
  }

  // Walk backward up to a generous cap to keep this O(N) where N is reasonable.
  const MAX_LOOKBACK = 365 * 5;
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const k = todayKey(cursor);
    const rec = history[k];
    const complete = rec && rec.prayers.length >= TARGET_PRAYERS_PER_DAY;

    if (complete) {
      streak += 1;
      // Award a life every 7 streak days, up to cap.
      if (streak % 7 === 0 && lives < livesCap) {
        lives = Math.min(livesCap, lives + 1);
      }
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    // Incomplete day → try to spend a life.
    if (lives > 0) {
      lives -= 1;
      livesUsed += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    break;
  }

  // Best streak = max contiguous full days anywhere in history (also use lives).
  const bestStreak = computeBestStreak(history);
  void livesUsed; // currently unused; reserved for future analytics
  return { streak, bestStreak, lives };
}

function computeBestStreak(history: Record<string, DayRecord>): number {
  const days = Object.keys(history).sort();
  if (days.length === 0) return 0;
  let best = 0;
  let run = 0;
  let prev: Date | null = null;

  for (const k of days) {
    const rec = history[k];
    const complete = rec.prayers.length >= TARGET_PRAYERS_PER_DAY;
    if (!complete) {
      run = 0;
      prev = null;
      continue;
    }
    const cur = parseDateKey(k);
    if (prev) {
      const diff = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
      if (diff === 1) run += 1;
      else run = 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = cur;
  }
  return best;
}

function parseDateKey(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* ---------- Total XP recompute ---------- */

function totalXpFromHistory(history: Record<string, DayRecord>): number {
  let total = 0;
  for (const k of Object.keys(history)) {
    total += dayXp(history[k]);
  }
  return total;
}

/* ---------- High-level actions ---------- */

/**
 * Idempotent: recompute derived fields (streak/best/lives/totalXp/todayXp)
 * from the source of truth (history). Call after any history mutation.
 */
export function recompute(p: Progress, now: Date = new Date()): Progress {
  const { streak, bestStreak, lives } = computeStreakAndLives(p.history, now);
  const totalXp = totalXpFromHistory(p.history);
  const todayRec = getTodayRecord(p, now);
  const todayXp = dayXp(todayRec);
  return {
    ...p,
    streak,
    bestStreak: Math.max(bestStreak, p.bestStreak), // never regress best
    lives,
    totalXp,
    todayXp,
    lastRecomputed: now.toISOString(),
  };
}

function setTodayRecord(p: Progress, rec: DayRecord): Progress {
  return { ...p, history: { ...p.history, [rec.date]: rec } };
}

export function markPrayer(
  p: Progress,
  key: PrayerKey,
  now: Date = new Date(),
): Progress {
  const today = getTodayRecord(p, now);
  if (today.prayers.includes(key)) return p; // no-op
  const next: DayRecord = {
    ...today,
    prayers: [...today.prayers, key],
    prayerXp: today.prayerXp + XP_PER_PRAYER,
  };
  return recompute(setTodayRecord(p, next), now);
}

export function unmarkPrayer(
  p: Progress,
  key: PrayerKey,
  now: Date = new Date(),
): Progress {
  const today = getTodayRecord(p, now);
  if (!today.prayers.includes(key)) return p;
  const next: DayRecord = {
    ...today,
    prayers: today.prayers.filter((k) => k !== key),
    prayerXp: Math.max(0, today.prayerXp - XP_PER_PRAYER),
  };
  return recompute(setTodayRecord(p, next), now);
}

export function addQuestXp(
  p: Progress,
  amount: number,
  now: Date = new Date(),
): Progress {
  if (amount === 0) return p;
  const today = getTodayRecord(p, now);
  const next: DayRecord = {
    ...today,
    questXp: Math.max(0, today.questXp + amount),
  };
  return recompute(setTodayRecord(p, next), now);
}

/* ---------- Achievement integration ---------- */

export function unlockAchievements(p: Progress, ids: string[]): Progress {
  if (ids.length === 0) return p;
  const set = new Set(p.unlockedAchievements);
  for (const id of ids) set.add(id);
  return { ...p, unlockedAchievements: Array.from(set) };
}
