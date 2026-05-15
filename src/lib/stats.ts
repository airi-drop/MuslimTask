import {
  PRAYER_KEYS,
  TARGET_PRAYERS_PER_DAY,
  todayKey,
  type DayRecord,
  type PrayerKey,
  type Progress,
} from "./progress";

export type DailyBar = {
  /** YYYY-MM-DD */
  dateKey: string;
  /** Local date object (start of day) */
  date: Date;
  /** Indonesian short weekday: Sen, Sel, ... */
  weekday: string;
  /** 0..5 */
  prayedCount: number;
  /** XP earned that day (prayer + quest) */
  xp: number;
  /** prayed === target */
  perfect: boolean;
};

export type Heatmap = DailyBar[];

export type StatsSummary = {
  /** Number of obligatory salat marked across the last 30 days. */
  totalPrayers30d: number;
  /** Max possible (30 * 5). */
  prayerTarget30d: number;
  /** % of obligatory prayers completed in 30 days, 0–100. */
  consistency30d: number;
  /** Sum of XP earned in last 30 days. */
  xp30d: number;
  /** Days where all 5 prayers were marked, in last 30 days. */
  perfectDays30d: number;
  /** % completion per prayer in last 30 days. */
  perPrayer30d: Record<PrayerKey, number>;
  /** Best & worst prayer */
  bestPrayer: { key: PrayerKey; pct: number } | null;
  worstPrayer: { key: PrayerKey; pct: number } | null;
  /** Number of incomplete days in last 30 (i.e. days < 5 prayers). */
  incompleteDays30d: number;
};

export const PRAYER_LABEL: Record<PrayerKey, string> = {
  fajr: "Subuh",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

const ID_WEEKDAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/* ---------- Range helpers ---------- */

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function shiftDate(d: Date, offsetDays: number): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() + offsetDays);
  return x;
}

function dayXpFromRecord(rec: DayRecord | undefined): number {
  if (!rec) return 0;
  return (rec.prayerXp ?? 0) + (rec.questXp ?? 0);
}

/* ---------- Range generators ---------- */

/**
 * Returns 7 day-records ordered Monday → Sunday for the ISO week containing
 * `now`.
 */
export function getWeekBars(progress: Progress, now: Date = new Date()): DailyBar[] {
  // Monday-based week: getDay() returns 0..6 (Sun=0). Compute Monday.
  const day = now.getDay() === 0 ? 7 : now.getDay(); // 1..7, Mon=1
  const monday = shiftDate(now, -(day - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = shiftDate(monday, i);
    const dateKey = todayKey(date);
    const rec = progress.history[dateKey];
    return {
      dateKey,
      date,
      weekday: ID_WEEKDAYS_SHORT[date.getDay()],
      prayedCount: rec?.prayers.length ?? 0,
      xp: dayXpFromRecord(rec),
      perfect: (rec?.prayers.length ?? 0) >= TARGET_PRAYERS_PER_DAY,
    };
  });
}

/**
 * Returns N most-recent days (oldest → newest, ending today).
 */
export function getRecentDays(
  progress: Progress,
  days: number,
  now: Date = new Date(),
): DailyBar[] {
  return Array.from({ length: days }, (_, i) => {
    const offset = -(days - 1 - i);
    const date = shiftDate(now, offset);
    const dateKey = todayKey(date);
    const rec = progress.history[dateKey];
    return {
      dateKey,
      date,
      weekday: ID_WEEKDAYS_SHORT[date.getDay()],
      prayedCount: rec?.prayers.length ?? 0,
      xp: dayXpFromRecord(rec),
      perfect: (rec?.prayers.length ?? 0) >= TARGET_PRAYERS_PER_DAY,
    };
  });
}

/* ---------- Heatmap intensity ---------- */

/** Map prayedCount (0..5) to discrete intensity 0..4 */
export function intensity(prayedCount: number): 0 | 1 | 2 | 3 | 4 {
  if (prayedCount <= 0) return 0;
  if (prayedCount === 1) return 1;
  if (prayedCount <= 2) return 2;
  if (prayedCount <= 4) return 3;
  return 4;
}

/* ---------- Summary ---------- */

/** Find the earliest YYYY-MM-DD in history. Returns null if empty. */
function firstRecordedDay(progress: Progress): string | null {
  const keys = Object.keys(progress.history);
  if (keys.length === 0) return null;
  let min = keys[0];
  for (const k of keys) {
    if (k < min) min = k;
  }
  return min;
}

export function buildSummary(
  progress: Progress,
  now: Date = new Date(),
): StatsSummary {
  const allDays = getRecentDays(progress, 30, now);
  const firstDay = firstRecordedDay(progress);
  // Only count days from firstRecordedDay onwards. Days before user started
  // tracking shouldn't count as "incomplete".
  const days = firstDay
    ? allDays.filter((d) => d.dateKey >= firstDay)
    : allDays;

  let totalPrayers = 0;
  let xp = 0;
  let perfect = 0;
  let incomplete = 0;
  const perPrayerCount: Record<PrayerKey, number> = {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };

  for (const d of days) {
    const rec = progress.history[d.dateKey];
    if (!rec) {
      incomplete += 1;
      continue;
    }
    totalPrayers += rec.prayers.length;
    xp += dayXpFromRecord(rec);
    if (rec.prayers.length >= TARGET_PRAYERS_PER_DAY) perfect += 1;
    else incomplete += 1;
    for (const p of rec.prayers) {
      if (p in perPrayerCount) perPrayerCount[p as PrayerKey] += 1;
    }
  }

  const denom = days.length || 1;
  const target = days.length * TARGET_PRAYERS_PER_DAY;
  const perPrayerPct: Record<PrayerKey, number> = {
    fajr: pct(perPrayerCount.fajr, denom),
    dhuhr: pct(perPrayerCount.dhuhr, denom),
    asr: pct(perPrayerCount.asr, denom),
    maghrib: pct(perPrayerCount.maghrib, denom),
    isha: pct(perPrayerCount.isha, denom),
  };

  const sortedByPct = (Object.keys(perPrayerPct) as PrayerKey[]).sort(
    (a, b) => perPrayerPct[b] - perPrayerPct[a],
  );

  return {
    totalPrayers30d: totalPrayers,
    prayerTarget30d: target,
    consistency30d: pct(totalPrayers, target),
    xp30d: xp,
    perfectDays30d: perfect,
    perPrayer30d: perPrayerPct,
    bestPrayer: sortedByPct.length
      ? { key: sortedByPct[0], pct: perPrayerPct[sortedByPct[0]] }
      : null,
    worstPrayer: sortedByPct.length
      ? {
          key: sortedByPct[sortedByPct.length - 1],
          pct: perPrayerPct[sortedByPct[sortedByPct.length - 1]],
        }
      : null,
    incompleteDays30d: incomplete,
  };
}

/** Percentage with safe divisor; returns 0..100 rounded. */
function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

/* Re-export for convenience */
export { PRAYER_KEYS };

/* ---------- Quick highlight cards ---------- */

export function pickHighlight(summary: StatsSummary): {
  title: string;
  description: string;
} {
  if (summary.totalPrayers30d === 0) {
    return {
      title: "Mulai catat ibadahmu",
      description:
        "Belum ada data 30 hari. Tandai salat di Dashboard untuk mengisi statistik.",
    };
  }
  if (summary.perfectDays30d >= 7) {
    return {
      title: "Performa luar biasa",
      description: `${summary.perfectDays30d} hari sempurna dalam 30 hari terakhir. Pertahankan!`,
    };
  }
  if (summary.bestPrayer && summary.worstPrayer && summary.bestPrayer.pct > 0) {
    return {
      title: `Konsisten di ${PRAYER_LABEL[summary.bestPrayer.key]}`,
      description: `Salat ${PRAYER_LABEL[summary.worstPrayer.key]} masih bisa lebih konsisten (${summary.worstPrayer.pct}%).`,
    };
  }
  return {
    title: "Terus tingkatkan",
    description: "Lanjutkan rutinmu — setiap salat adalah XP.",
  };
}
