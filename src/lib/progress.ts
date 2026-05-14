import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";

/**
 * Per-day record: which obligatory salat were marked done, plus xp earned.
 * Date key is local YYYY-MM-DD.
 */
export type DayRecord = {
  date: string;
  prayers: string[]; // subset of ["fajr","dhuhr","asr","maghrib","isha"]
  xp: number;
};

export type Progress = {
  streak: number;
  bestStreak: number;
  lives: number; // "Nyawa Streak"
  totalXp: number;
  todayXp: number;
  history: Record<string, DayRecord>; // by date
};

export const XP_PER_PRAYER = 10;
export const XP_PER_LEVEL = 100;
export const TARGET_PRAYERS_PER_DAY = 5;

export const EMPTY_PROGRESS: Progress = {
  streak: 0,
  bestStreak: 0,
  lives: 0,
  totalXp: 0,
  todayXp: 0,
  history: {},
};

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadProgress(): Progress {
  const p = readJSON<Progress>(STORAGE_KEYS.progress, EMPTY_PROGRESS);
  // ensure history exists
  if (!p.history) p.history = {};
  return p;
}

export function saveProgress(p: Progress): void {
  writeJSON(STORAGE_KEYS.progress, p);
}

export function levelFromXp(xp: number): { level: number; intoLevel: number; toNext: number } {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  const toNext = XP_PER_LEVEL - intoLevel;
  return { level, intoLevel, toNext };
}

export function getTodayRecord(p: Progress, date: Date = new Date()): DayRecord {
  const key = todayKey(date);
  return p.history[key] ?? { date: key, prayers: [], xp: 0 };
}
