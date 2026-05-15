import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab as AdhanMadhab,
  type CalculationParameters,
} from "adhan";
import type { Location } from "./location";
import { loadSettings, type CalcMethod, type Madhab } from "./settings";

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerSlot = {
  key: PrayerKey;
  /** Display name in Indonesian. */
  name: string;
  time: Date;
  /** Whether this slot counts towards the 5 daily salat. */
  obligatory: boolean;
};

const NAMES: Record<PrayerKey, string> = {
  fajr: "Subuh",
  sunrise: "Syuruq",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

function buildParams(method: CalcMethod, madhab: Madhab): CalculationParameters {
  let p: CalculationParameters;
  switch (method) {
    case "Kemenag":
      // Kemenag Indonesia: Subuh 20°, Isya 18° — same as Singapore method.
      p = CalculationMethod.Singapore();
      break;
    case "Singapore":
      p = CalculationMethod.Singapore();
      break;
    case "MuslimWorldLeague":
      p = CalculationMethod.MuslimWorldLeague();
      break;
    case "Egyptian":
      p = CalculationMethod.Egyptian();
      break;
    case "Karachi":
      p = CalculationMethod.Karachi();
      break;
    case "UmmAlQura":
      p = CalculationMethod.UmmAlQura();
      break;
    default:
      p = CalculationMethod.Singapore();
  }
  p.madhab = madhab === "Hanafi" ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;
  return p;
}

function params(): CalculationParameters {
  const s = loadSettings();
  return buildParams(s.calcMethod, s.madhab);
}

export function getPrayerTimes(loc: Location, date: Date = new Date()): PrayerSlot[] {
  const coords = new Coordinates(loc.latitude, loc.longitude);
  const pt = new PrayerTimes(coords, date, params());

  const slots: PrayerSlot[] = [
    { key: "fajr", name: NAMES.fajr, time: pt.fajr, obligatory: true },
    { key: "sunrise", name: NAMES.sunrise, time: pt.sunrise, obligatory: false },
    { key: "dhuhr", name: NAMES.dhuhr, time: pt.dhuhr, obligatory: true },
    { key: "asr", name: NAMES.asr, time: pt.asr, obligatory: true },
    { key: "maghrib", name: NAMES.maghrib, time: pt.maghrib, obligatory: true },
    { key: "isha", name: NAMES.isha, time: pt.isha, obligatory: true },
  ];
  return slots;
}

/**
 * Find the next upcoming prayer. If all of today's prayers have passed,
 * returns tomorrow's Fajr.
 */
export function getNextPrayer(loc: Location, now: Date = new Date()): PrayerSlot {
  const today = getPrayerTimes(loc, now);
  const upcoming = today.find((s) => s.time.getTime() > now.getTime());
  if (upcoming) return upcoming;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next = getPrayerTimes(loc, tomorrow);
  // Tomorrow's fajr is index 0
  return next[0];
}

export function formatTime(date: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(date);
}

export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function humanizeCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h} jam ${m} menit lagi`;
  if (m > 0) return `${m} menit ${s} detik lagi`;
  return `${s} detik lagi`;
}
