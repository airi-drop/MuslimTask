import { readJSON, writeJSON } from "./storage";
import { todayKey } from "./progress";

export type DzikirSet = "pagi" | "petang" | "salat";

export type DzikirItem = {
  id: string;
  arabic: string;
  latin: string;
  translation: string;
  /** Default repetition count. */
  count: number;
  /** Optional source/citation. */
  source?: string;
};

export type DzikirSection = {
  set: DzikirSet;
  title: string;
  description: string;
  items: DzikirItem[];
};

/* ---------- Catalog ---------- */

const PAGI: DzikirItem[] = [
  {
    id: "tasbih",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    translation: "Maha Suci Allah.",
    count: 33,
  },
  {
    id: "tahmid",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    translation: "Segala puji bagi Allah.",
    count: 33,
  },
  {
    id: "takbir",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    translation: "Allah Maha Besar.",
    count: 33,
  },
  {
    id: "tahlil",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "La ilaha illallah wahdahu la syarika lahu, lahul-mulku walahul-hamdu wahuwa 'ala kulli syai'in qadir.",
    translation:
      "Tidak ada tuhan selain Allah, Yang Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, Dia Maha Kuasa atas segala sesuatu.",
    count: 10,
    source: "HR. Bukhari & Muslim",
  },
  {
    id: "ayat-kursi",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    latin: "Allahu la ilaha illa huwal-hayyul-qayyum…",
    translation:
      "Allah, tidak ada Tuhan selain Dia, Yang Hidup Kekal, terus-menerus mengurus makhluk-Nya...",
    count: 1,
    source: "Ayat Kursi (QS. Al-Baqarah: 255)",
  },
  {
    id: "salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
    latin: "Allahumma shalli 'ala sayyidina Muhammad",
    translation: "Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad.",
    count: 10,
  },
];

const PETANG: DzikirItem[] = [
  {
    id: "tasbih",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    translation: "Maha Suci Allah.",
    count: 33,
  },
  {
    id: "tahmid",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    translation: "Segala puji bagi Allah.",
    count: 33,
  },
  {
    id: "takbir",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    translation: "Allah Maha Besar.",
    count: 33,
  },
  {
    id: "lindungan",
    arabic:
      "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "A'udzu bi kalimatillahit-tammati min syarri ma khalaq.",
    translation:
      "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan.",
    count: 3,
    source: "HR. Muslim",
  },
  {
    id: "salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ",
    latin: "Allahumma shalli 'ala sayyidina Muhammad",
    translation: "Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad.",
    count: 10,
  },
];

const SALAT: DzikirItem[] = [
  {
    id: "istighfar",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    latin: "Astaghfirullah",
    translation: "Aku memohon ampun kepada Allah.",
    count: 3,
  },
  {
    id: "doa-keselamatan",
    arabic:
      "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    latin:
      "Allahumma antas-salam wa minkas-salam, tabarakta ya dzal-jalali wal-ikram.",
    translation:
      "Ya Allah, Engkau sumber keselamatan, dari-Mu segala keselamatan, Maha Berkah Engkau wahai Pemilik Keagungan dan Kemuliaan.",
    count: 1,
    source: "HR. Muslim",
  },
  {
    id: "tasbih",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    translation: "Maha Suci Allah.",
    count: 33,
  },
  {
    id: "tahmid",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    translation: "Segala puji bagi Allah.",
    count: 33,
  },
  {
    id: "takbir",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    translation: "Allah Maha Besar.",
    count: 33,
  },
  {
    id: "tahlil-penutup",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "La ilaha illallah wahdahu la syarika lahu, lahul-mulku walahul-hamdu wahuwa 'ala kulli syai'in qadir.",
    translation:
      "Tidak ada tuhan selain Allah, Yang Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, Dia Maha Kuasa atas segala sesuatu.",
    count: 1,
  },
];

export const DZIKIR_SECTIONS: DzikirSection[] = [
  {
    set: "pagi",
    title: "Dzikir Pagi",
    description:
      "Wirid pagi dibaca setelah Subuh hingga sebelum matahari terbit.",
    items: PAGI,
  },
  {
    set: "petang",
    title: "Dzikir Petang",
    description: "Wirid petang dibaca setelah Ashar hingga sebelum Maghrib.",
    items: PETANG,
  },
  {
    set: "salat",
    title: "Dzikir Setelah Salat",
    description: "Dibaca setelah selesai salat fardhu.",
    items: SALAT,
  },
];

/* ---------- Counter store ---------- */

export type DzikirCounters = {
  /** Local date the snapshot belongs to. Auto-resets when day changes. */
  dateKey: string;
  /** Per set, per item counter values: counters[set][itemId] = number */
  counters: Record<DzikirSet, Record<string, number>>;
};

const KEY = "mt:dzikir";

const empty = (): DzikirCounters => ({
  dateKey: todayKey(),
  counters: { pagi: {}, petang: {}, salat: {} },
});

export function loadDzikir(now: Date = new Date()): DzikirCounters {
  const stored = readJSON<DzikirCounters>(KEY, empty());
  if (stored.dateKey !== todayKey(now)) {
    // Auto-reset on new day
    return empty();
  }
  // Defensive shape
  return {
    dateKey: stored.dateKey,
    counters: {
      pagi: stored.counters?.pagi ?? {},
      petang: stored.counters?.petang ?? {},
      salat: stored.counters?.salat ?? {},
    },
  };
}

export function saveDzikir(c: DzikirCounters): void {
  writeJSON(KEY, c);
}

export function getCount(c: DzikirCounters, set: DzikirSet, id: string): number {
  return c.counters[set]?.[id] ?? 0;
}

export function setCount(
  c: DzikirCounters,
  set: DzikirSet,
  id: string,
  value: number,
): DzikirCounters {
  return {
    ...c,
    counters: {
      ...c.counters,
      [set]: { ...c.counters[set], [id]: Math.max(0, value) },
    },
  };
}

export function incrementCount(
  c: DzikirCounters,
  set: DzikirSet,
  id: string,
  max: number,
): { next: DzikirCounters; reachedTarget: boolean; value: number } {
  const cur = getCount(c, set, id);
  if (cur >= max) return { next: c, reachedTarget: false, value: cur };
  const value = Math.min(max, cur + 1);
  const next = setCount(c, set, id, value);
  return { next, reachedTarget: value === max && cur < max, value };
}

export function resetSet(c: DzikirCounters, set: DzikirSet): DzikirCounters {
  return {
    ...c,
    counters: { ...c.counters, [set]: {} },
  };
}

/** Returns true if every item in the section has reached its target. */
export function isSectionDone(
  c: DzikirCounters,
  section: DzikirSection,
): boolean {
  return section.items.every(
    (it) => getCount(c, section.set, it.id) >= it.count,
  );
}

export function sectionProgress(
  c: DzikirCounters,
  section: DzikirSection,
): { done: number; total: number } {
  let done = 0;
  for (const it of section.items) {
    if (getCount(c, section.set, it.id) >= it.count) done += 1;
  }
  return { done, total: section.items.length };
}
