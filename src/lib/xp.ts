/**
 * PRD Phase 3 — Tiered XP Engine
 * Calculates XP based on timing precision, not flat per-prayer.
 */

// =====================
// PRAYER XP — tiered by timing difference
// =====================
export function calculatePrayerXP(
  prayerTime: Date,
  claimTime: Date,
  isJamaah: boolean = false,
): number {
  const diffMs = claimTime.getTime() - prayerTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  // Not yet time
  if (diffMinutes < 0) return 0;

  let xp: number;
  if (diffMinutes <= 10) xp = 100;
  else if (diffMinutes <= 30) xp = 75;
  else if (diffMinutes <= 60) xp = 50;
  else if (diffMinutes <= 120) xp = 25;
  else xp = 10;

  if (isJamaah) xp += 20;

  return xp;
}

// =====================
// SUNNAH XP constants
// =====================
export const SUNNAH_XP = {
  rawatib: 15,
  dhuha: 30,
  tahajud: 50,
  witir: 20,
} as const;

// =====================
// DZIKIR XP — window-based
// =====================
export function getDzikirXP(
  type: "pagi" | "petang",
  schedule: { fajr: Date; sunrise: Date; asr: Date; maghrib: Date },
  claimTime: Date,
): number {
  const BASE = 15;
  const LATE = 5;

  if (type === "pagi") {
    const inWindow =
      claimTime.getTime() >= schedule.fajr.getTime() &&
      claimTime.getTime() <= schedule.sunrise.getTime();
    return inWindow ? BASE : LATE;
  }

  // petang
  const inWindow =
    claimTime.getTime() >= schedule.asr.getTime() &&
    claimTime.getTime() <= schedule.maghrib.getTime();
  return inWindow ? BASE : LATE;
}

// =====================
// QURAN XP — by ayat count
// =====================
export function getQuranXP(ayat: number): number {
  if (ayat <= 0) return 0;
  if (ayat <= 4) return 10;
  if (ayat <= 10) return 20;
  if (ayat <= 20) return 35;
  if (ayat >= 30) return 100;
  return Math.floor(ayat * 1.5);
}

// =====================
// XP timing label (Indonesian)
// =====================
export function getTimingLabel(diffMinutes: number): string {
  if (diffMinutes <= 10) return "Tepat Waktu ✓";
  if (diffMinutes <= 30) return "Agak Telat";
  if (diffMinutes <= 60) return "Telat";
  if (diffMinutes <= 120) return "Sangat Telat";
  return "Hampir Qadha";
}
