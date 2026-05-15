import surahListJson from "@/data/quran-list.json";
import { readJSON, writeJSON } from "./storage";

export type SurahMeta = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
};

export type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
};

export type SurahDetail = SurahMeta & {
  ayat: Ayat[];
  /** when this detail was cached (ms epoch) */
  cachedAt?: number;
};

export const SURAH_LIST: SurahMeta[] = surahListJson as SurahMeta[];

/* ---------- Detail cache ---------- */

const DETAIL_KEY = (n: number) => `mt:quran:surah:${n}`;
/** Recent surah numbers, most-recent first. */
const RECENT_KEY = "mt:quran:recent";
const RECENT_MAX = 5;
/** Per-ayat bookmark store: { surah: number[] } */
const BOOKMARK_KEY = "mt:quran:bookmarks";
/** Last reading position. */
const LAST_READ_KEY = "mt:quran:lastread";

export type LastRead = {
  surah: number;
  ayat: number;
  at: number;
};

export type BookmarkStore = Record<string, number[]>;

export function loadCachedSurah(n: number): SurahDetail | null {
  return readJSON<SurahDetail | null>(DETAIL_KEY(n), null);
}

export function saveCachedSurah(detail: SurahDetail): void {
  writeJSON(DETAIL_KEY(detail.nomor), {
    ...detail,
    cachedAt: Date.now(),
  });
}

export async function fetchSurah(n: number): Promise<SurahDetail> {
  // 1. Try local cache first (offline-first).
  const cached = loadCachedSurah(n);
  if (cached && cached.ayat?.length) return cached;

  // 2. Fetch from network.
  const res = await fetch(`https://equran.id/api/v2/surat/${n}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gagal mengambil surah ${n}`);
  const body = (await res.json()) as { data: SurahDetail & { deskripsi?: string } };
  const detail: SurahDetail = {
    nomor: body.data.nomor,
    nama: body.data.nama,
    namaLatin: body.data.namaLatin,
    jumlahAyat: body.data.jumlahAyat,
    tempatTurun: body.data.tempatTurun,
    arti: body.data.arti,
    ayat: body.data.ayat,
  };
  saveCachedSurah(detail);
  return detail;
}

/* ---------- Recent / search ---------- */

export function pushRecent(n: number): void {
  const list = readJSON<number[]>(RECENT_KEY, []);
  const next = [n, ...list.filter((x) => x !== n)].slice(0, RECENT_MAX);
  writeJSON(RECENT_KEY, next);
}

export function loadRecent(): SurahMeta[] {
  const ids = readJSON<number[]>(RECENT_KEY, []);
  return ids
    .map((id) => SURAH_LIST.find((s) => s.nomor === id))
    .filter((s): s is SurahMeta => Boolean(s));
}

export function searchSurah(q: string): SurahMeta[] {
  const term = q.trim().toLowerCase();
  if (!term) return SURAH_LIST;
  return SURAH_LIST.filter((s) => {
    if (String(s.nomor) === term) return true;
    if (s.namaLatin.toLowerCase().includes(term)) return true;
    if (s.arti.toLowerCase().includes(term)) return true;
    return false;
  });
}

/* ---------- Bookmark ---------- */

export function loadBookmarks(): BookmarkStore {
  return readJSON<BookmarkStore>(BOOKMARK_KEY, {});
}

export function isBookmarked(n: number, ayat: number): boolean {
  const store = loadBookmarks();
  return (store[String(n)] ?? []).includes(ayat);
}

export function toggleBookmark(n: number, ayat: number): boolean {
  const store = loadBookmarks();
  const key = String(n);
  const arr = store[key] ?? [];
  const exists = arr.includes(ayat);
  const next = exists ? arr.filter((a) => a !== ayat) : [...arr, ayat].sort((a, b) => a - b);
  if (next.length === 0) delete store[key];
  else store[key] = next;
  writeJSON(BOOKMARK_KEY, store);
  return !exists;
}

export function flatBookmarks(): { surah: SurahMeta; ayat: number }[] {
  const store = loadBookmarks();
  const out: { surah: SurahMeta; ayat: number }[] = [];
  for (const k of Object.keys(store)) {
    const meta = SURAH_LIST.find((s) => s.nomor === Number(k));
    if (!meta) continue;
    for (const a of store[k]) out.push({ surah: meta, ayat: a });
  }
  return out;
}

export function clearAllBookmarks(): void {
  writeJSON(BOOKMARK_KEY, {});
}

/* ---------- Last read ---------- */

export function loadLastRead(): LastRead | null {
  return readJSON<LastRead | null>(LAST_READ_KEY, null);
}

export function saveLastRead(surah: number, ayat: number): void {
  writeJSON<LastRead>(LAST_READ_KEY, { surah, ayat, at: Date.now() });
}
