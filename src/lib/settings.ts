import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";

export type CalcMethod =
  | "Singapore"
  | "MuslimWorldLeague"
  | "Egyptian"
  | "Karachi"
  | "UmmAlQura"
  | "Kemenag";

export type Madhab = "Shafi" | "Hanafi";

export type Qari = "alafasy" | "minshawi" | "sudais";

export type Language = "id" | "en";

export type Settings = {
  /** User-visible name. Empty string = use default "Musafir". */
  username: string;
  /** Prayer time calculation method. */
  calcMethod: CalcMethod;
  /** Asr madhab — Shafi/Hanbali/Maliki = Shafi (default), Hanafi = later */
  madhab: Madhab;
  /** Notifications enabled (foreground reminder when prayer time hits). */
  notifications: boolean;
  /** Vibration feedback for taps. */
  vibrate: boolean;
  /** Audio reciter for Quran audio playback. */
  qari: Qari;
  /** Show transliteration in Quran reader by default. */
  showLatin: boolean;
  /** UI language. */
  language: Language;
};

export const DEFAULT_SETTINGS: Settings = {
  username: "",
  calcMethod: "Kemenag",
  madhab: "Shafi",
  notifications: false,
  vibrate: true,
  qari: "alafasy",
  showLatin: true,
  language: "id",
};

export function loadSettings(): Settings {
  const raw = readJSON<Partial<Settings>>(STORAGE_KEYS.settings, {});
  return { ...DEFAULT_SETTINGS, ...raw };
}

export function saveSettings(s: Settings): void {
  writeJSON(STORAGE_KEYS.settings, s);
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const next = { ...loadSettings(), ...patch };
  saveSettings(next);
  return next;
}

/** Resolve username with fallback. */
export function displayName(s: Settings): string {
  const t = s.username.trim();
  return t.length > 0 ? t : "Musafir";
}

export const CALC_METHOD_LABEL: Record<CalcMethod, string> = {
  Kemenag: "Kemenag (Indonesia)",
  Singapore: "Singapore (MUIS)",
  MuslimWorldLeague: "Muslim World League",
  Egyptian: "Egyptian General Authority",
  Karachi: "Univ. Sains Islam Karachi",
  UmmAlQura: "Umm Al-Qura (Saudi)",
};

export const CALC_METHOD_DESC: Record<CalcMethod, string> = {
  Kemenag:
    "Sudut Subuh 20°, Isya 18°. Cocok untuk wilayah Indonesia (mengikuti pendekatan Kemenag).",
  Singapore: "Sudut Subuh 20°, Isya 18°. Standar MUIS Singapura.",
  MuslimWorldLeague: "Sudut Subuh 18°, Isya 17°. Banyak digunakan secara global.",
  Egyptian: "Sudut Subuh 19,5°, Isya 17,5°.",
  Karachi: "Sudut Subuh 18°, Isya 18°.",
  UmmAlQura: "Subuh 18,5°, Isya 90 menit setelah Maghrib.",
};

export const MADHAB_LABEL: Record<Madhab, string> = {
  Shafi: "Syafi'i / Maliki / Hanbali",
  Hanafi: "Hanafi (Ashar lebih lambat)",
};

export const QARI_LABEL: Record<Qari, string> = {
  alafasy: "Mishary Rashid Alafasy",
  minshawi: "Mohamed Siddiq El-Minshawi",
  sudais: "Abdurrahman As-Sudais",
};

/** Map qari to equran.id audioFull key (1..5). */
export const QARI_KEY: Record<Qari, "01" | "02" | "03" | "04" | "05"> = {
  alafasy: "05",
  minshawi: "01",
  sudais: "03",
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};
