// Hijri date conversion using Intl with islamic-umalqura calendar.
// Works fully offline — built into modern browsers / Node.

const MONTH_NAMES_ID = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Zulkaidah",
  "Zulhijjah",
];

const WEEKDAYS_ID = [
  "Ahad",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export type HijriDate = {
  day: number;
  monthIndex: number; // 0-based
  monthName: string;
  year: number;
  weekday: string;
  /** "Kamis, 26 Zulkaidah 1447 H" */
  formatted: string;
};

export function toHijri(date: Date = new Date()): HijriDate {
  const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = parseInt(get("day"), 10);
  const monthIndex = parseInt(get("month"), 10) - 1;
  // year part may include " AH" — strip non-digits
  const yearStr = get("year").replace(/\D/g, "");
  const year = parseInt(yearStr, 10);

  const weekday = WEEKDAYS_ID[date.getDay()];
  const monthName = MONTH_NAMES_ID[monthIndex] ?? "";
  const formatted = `${weekday}, ${day} ${monthName} ${year} H`;

  return { day, monthIndex, monthName, year, weekday, formatted };
}

export function formatGregorian(date: Date = new Date()): string {
  // "Kamis, 14 Mei 2026"
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
