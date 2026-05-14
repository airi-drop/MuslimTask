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
  lives: number; // "Nyawa Streak" — pelindung saat lewatkan 1 hari
  totalXp: number;
  todayXp: number;
  history: Record<string, DayRecord>;
  /** Achievement IDs that have been unlocked. */
  unlockedAchievements: string[];
  /** Last time we recomputed — used to skip work if same minute. */
  lastRecomputed?: string;
  /** Days (YYYY-MM-DD) where a life was spent to save the streak. */
  livesSpentOn: string[];
  /**
   * Date keys of save events the user has *seen* (acknowledged the modal).
   * Used so we only show "Streak diselamatkan" once per save.
   */
  saveEventsSeen: string[];
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
  livesSpentOn: [],
  saveEventsSeen: [],
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
    livesSpentOn: p.livesSpentOn ?? [],
    saveEventsSeen: p.saveEventsSeen ?? [],
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
 * Compute streak / lives / save events from history alone.
 *
 * Algorithm (deterministic, idempotent):
 *   1. Walk back day-by-day from today. Today only "counts" if it's complete;
 *      otherwise we start counting from yesterday — today is in-progress and
 *      shouldn't break the streak.
 *   2. Earned lives are accumulated as the streak grows: every full 7th day
 *      grants +1 life, capped at 3.
 *   3. Spent lives are accumulated as we hit gaps: each incomplete day in
 *      the streak path "costs" a life. If we run out of lives, streak ends.
 *   4. The CURRENT lives balance = earned - spent. Save events list = the
 *      gap days where a life was actually spent.
 */
export function computeStreakAndLives(
  history: Record<string, DayRecord>,
  now: Date = new Date(),
): {
  streak: number;
  bestStreak: number;
  lives: number;
  livesSpentOn: string[];
  /** YYYY-MM-DD of latest gap that was just covered by a life. */
  latestSave: string | null;
} {
  const livesCap = 3;
  const todayK = todayKey(now);
  const todayRec = history[todayK];
  const todayComplete =
    todayRec && todayRec.prayers.length >= TARGET_PRAYERS_PER_DAY;

  let streak = 0;
  let earnedLives = 0;
  let spentLives = 0;
  const livesSpentOn: string[] = [];

  let cursor = new Date(now);
  if (!todayComplete) cursor.setDate(cursor.getDate() - 1);

  const MAX_LOOKBACK = 365 * 5;
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const k = todayKey(cursor);
    const rec = history[k];
    const complete = rec && rec.prayers.length >= TARGET_PRAYERS_PER_DAY;

    if (complete) {
      streak += 1;
      // Award a life every 7 streak days, up to cap.
      if (streak % 7 === 0 && earnedLives - spentLives < livesCap) {
        earnedLives += 1;
      }
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    // Incomplete day → can a life cover it?
    if (earnedLives - spentLives > 0) {
      spentLives += 1;
      livesSpentOn.push(k);
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    break;
  }

  const lives = Math.max(0, earnedLives - spentLives);
  const bestStreak = computeBestStreak(history);
  const latestSave = livesSpentOn[0] ?? null; // most recent gap (we walked backward)

  return { streak, bestStreak, lives, livesSpentOn, latestSave };
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
  const r = computeStreakAndLives(p.history, now);
  const totalXp = totalXpFromHistory(p.history);
  const todayRec = getTodayRecord(p, now);
  const todayXp = dayXp(todayRec);
  return {
    ...p,
    streak: r.streak,
    bestStreak: Math.max(r.bestStreak, p.bestStreak),
    lives: r.lives,
    livesSpentOn: r.livesSpentOn,
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

/* ---------- Save event helpers ---------- */

/**
 * Returns life-saved events the user hasn't seen yet, so we can pop a
 * one-time "Streak diselamatkan!" toast.
 */
export function unseenSaveEvents(p: Progress): string[] {
  const seen = new Set(p.saveEventsSeen);
  return p.livesSpentOn.filter((k) => !seen.has(k));
}

export function markSaveEventsSeen(p: Progress, ids: string[]): Progress {
  if (ids.length === 0) return p;
  const set = new Set([...p.saveEventsSeen, ...ids]);
  return { ...p, saveEventsSeen: Array.from(set) };
}
