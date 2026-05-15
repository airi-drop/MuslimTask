import { getPrayerTimes, type PrayerSlot } from "./prayer";
import type { Location } from "./location";

export type WindowState = {
  /** Whether this is currently the recommended time window. */
  active: boolean;
  /** Short user-facing label, e.g. "Subuh-Syuruq". */
  label: string;
  /** Description of when this is recommended. */
  description: string;
  /** Optional ms until window opens (negative if already open or over). */
  startsInMs?: number;
  /** Optional ms until window closes (negative if already closed). */
  endsInMs?: number;
  /** Status text: "Sekarang", "Sebentar lagi", "Lewat", "Belum waktunya". */
  statusLabel: string;
};

type Range = { start: Date; end: Date };

function getSlot(slots: PrayerSlot[], key: PrayerSlot["key"]): Date {
  const s = slots.find((x) => x.key === key);
  if (!s) throw new Error(`Slot ${key} not found`);
  return s.time;
}

function range(slots: PrayerSlot[], def: { start: PrayerSlot["key"]; end: PrayerSlot["key"]; startOffsetMin?: number; endOffsetMin?: number }): Range {
  const start = new Date(getSlot(slots, def.start));
  if (def.startOffsetMin) start.setMinutes(start.getMinutes() + def.startOffsetMin);
  const end = new Date(getSlot(slots, def.end));
  if (def.endOffsetMin) end.setMinutes(end.getMinutes() + def.endOffsetMin);
  return { start, end };
}

/**
 * Calculate the recommended time window for a quest given the user's
 * location and current time.
 *
 * Quest IDs supported: dzikir-pagi, dzikir-petang, tahajud-3x, dhuha-3x,
 * al-kahfi-jumat. Returns null for quests without a meaningful window.
 */
export function getQuestWindow(
  questId: string,
  loc: Location,
  now: Date = new Date(),
): WindowState | null {
  const slots = getPrayerTimes(loc, now);

  switch (questId) {
    case "dzikir-pagi": {
      // Subuh → Syuruq + 30 min (matahari naik sepenggalah)
      const r = range(slots, { start: "fajr", end: "sunrise", endOffsetMin: 30 });
      return makeState(now, r, "Subuh – Syuruq+30m", "Setelah Subuh hingga matahari naik sepenggalah.");
    }
    case "dzikir-petang": {
      // Ashar → Maghrib
      const r = range(slots, { start: "asr", end: "maghrib" });
      return makeState(now, r, "Ashar – Maghrib", "Setelah Ashar hingga sebelum Maghrib.");
    }
    case "dhuha-3x": {
      // Syuruq + 30min → Dzuhur - 10min
      const r = range(slots, { start: "sunrise", end: "dhuhr", startOffsetMin: 30, endOffsetMin: -10 });
      return makeState(now, r, "Syuruq+30m – Dzuhur", "Sekitar 30 menit setelah matahari terbit hingga sebelum Dzuhur.");
    }
    case "tahajud-3x": {
      // Last 1/3 of night: from Isya midpoint towards Fajr.
      // Approximation: Isya + (Fajr_next - Isya) * 2/3, until Fajr.
      const isha = new Date(getSlot(slots, "isha"));
      let fajr = new Date(getSlot(slots, "fajr"));
      // If Fajr today is before Isya today (always is), use tomorrow's Fajr
      // for window calculation
      if (fajr.getTime() <= isha.getTime()) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        fajr = new Date(getPrayerTimes(loc, tomorrow).find((s) => s.key === "fajr")!.time);
      }
      const totalNight = fajr.getTime() - isha.getTime();
      const lastThirdStart = new Date(isha.getTime() + totalNight * (2 / 3));
      return makeState(
        now,
        { start: lastThirdStart, end: fajr },
        "Sepertiga malam – Subuh",
        "Waktu utama tahajud adalah sepertiga malam terakhir.",
      );
    }
    case "al-kahfi-jumat": {
      // Recommended: Thursday Maghrib through Friday Maghrib (24h window).
      const day = now.getDay(); // 0 Sun .. 5 Fri .. 6 Sat
      // We treat Friday as the active day (Kamis malam s.d. Maghrib Jumat).
      const ref = new Date(now);
      ref.setHours(0, 0, 0, 0);
      // Compute last Friday Maghrib relative to now
      const friday = new Date(ref);
      // Find this week's Friday
      const offsetToFriday = (5 - friday.getDay() + 7) % 7;
      friday.setDate(friday.getDate() + offsetToFriday);
      const fridaySlots = getPrayerTimes(loc, friday);
      const fridayMaghrib = new Date(getSlot(fridaySlots, "maghrib"));
      const thursdayMaghrib = new Date(fridayMaghrib);
      thursdayMaghrib.setDate(thursdayMaghrib.getDate() - 1);
      // Active window: Thursday Maghrib → Friday Maghrib
      void day;
      return makeState(
        now,
        { start: thursdayMaghrib, end: fridayMaghrib },
        "Kamis Maghrib – Jumat Maghrib",
        "Sunnah membaca Al-Kahfi pada hari Jumat (mulai Kamis malam).",
      );
    }
    case "puasa-senin-kamis": {
      // Active during fasting hours on Monday or Thursday.
      const day = now.getDay(); // 1=Mon, 4=Thu
      if (day !== 1 && day !== 4) {
        // Compute next Mon or Thu fajr.
        const nextDay = new Date(now);
        // simple: roll forward up to 7 days
        for (let i = 1; i <= 7; i++) {
          nextDay.setDate(nextDay.getDate() + 1);
          const d = nextDay.getDay();
          if (d === 1 || d === 4) break;
        }
        const fSlots = getPrayerTimes(loc, nextDay);
        const start = new Date(getSlot(fSlots, "fajr"));
        const end = new Date(getSlot(fSlots, "maghrib"));
        return makeState(now, { start, end }, "Senin/Kamis", "Puasa sunnah Senin & Kamis.");
      }
      const fajr = new Date(getSlot(slots, "fajr"));
      const maghrib = new Date(getSlot(slots, "maghrib"));
      return makeState(now, { start: fajr, end: maghrib }, "Senin/Kamis", "Puasa sunnah Senin & Kamis.");
    }
    default:
      return null;
  }
}

function makeState(now: Date, r: Range, label: string, description: string): WindowState {
  const t = now.getTime();
  const startsInMs = r.start.getTime() - t;
  const endsInMs = r.end.getTime() - t;
  const active = startsInMs <= 0 && endsInMs > 0;

  let statusLabel: string;
  if (active) {
    statusLabel = "Sekarang waktunya";
  } else if (startsInMs > 0) {
    if (startsInMs < 60 * 60 * 1000) statusLabel = "Sebentar lagi";
    else statusLabel = "Belum waktunya";
  } else {
    statusLabel = "Lewat untuk hari ini";
  }

  return { active, label, description, startsInMs, endsInMs, statusLabel };
}

/** Compute window for a dzikir set ("pagi" | "petang"). */
export function getDzikirWindow(
  set: "pagi" | "petang" | "salat",
  loc: Location,
  now: Date = new Date(),
): WindowState | null {
  if (set === "pagi") return getQuestWindow("dzikir-pagi", loc, now);
  if (set === "petang") return getQuestWindow("dzikir-petang", loc, now);
  return null;
}
