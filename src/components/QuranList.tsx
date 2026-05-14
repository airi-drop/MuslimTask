"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  SURAH_LIST,
  flatBookmarks,
  loadLastRead,
  loadRecent,
  searchSurah,
  type LastRead,
  type SurahMeta,
} from "@/lib/quran";
import { subscribeStorage } from "@/lib/storage";

export function QuranList() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<SurahMeta[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setRecent(loadRecent());
      setLastRead(loadLastRead());
      setBookmarkCount(flatBookmarks().length);
    };
    refresh();
    setHydrated(true);
    return subscribeStorage((key) => {
      if (key.startsWith("mt:quran")) refresh();
    });
  }, []);

  const filtered = useMemo(() => searchSurah(query), [query]);

  const lastReadMeta = lastRead
    ? SURAH_LIST.find((s) => s.nomor === lastRead.surah)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Al-Quran"
        title="Al-Quran Digital"
        description="114 surah lengkap dengan terjemahan Bahasa Indonesia. Surah yang sudah dibuka tersimpan otomatis untuk akses offline."
      />

      {/* Last read banner */}
      {hydrated && lastReadMeta && lastRead && (
        <Link
          href={`/mihrab/quran/${lastRead.surah}#ayat-${lastRead.ayat}`}
          className="card-feature relative flex flex-wrap items-center gap-4 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 font-display text-xl font-bold text-emerald-950 shadow-glow-amber">
            {lastRead.surah}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neon-400">
              Lanjutkan Bacaan
            </div>
            <div className="truncate font-display text-xl font-bold text-parchment-50">
              {lastReadMeta.namaLatin}{" "}
              <span className="text-parchment-100/60">
                · Ayat {lastRead.ayat}
              </span>
            </div>
            <div className="truncate text-xs text-parchment-100/70">
              {lastReadMeta.arti} · {lastReadMeta.jumlahAyat} ayat
            </div>
          </div>
          <span className="shrink-0 text-sm font-semibold text-neon-400">
            Lanjut →
          </span>
        </Link>
      )}

      {/* Search */}
      <section className="card flex items-center gap-3 px-4 py-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-emerald-700/70 dark:text-neon-500/70" />
        <input
          type="search"
          inputMode="search"
          placeholder="Cari surah… (nama, nomor, atau arti)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-emerald-800 placeholder:text-emerald-700/40 focus:outline-none dark:text-parchment-50 dark:placeholder:text-parchment-100/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs font-semibold text-emerald-700/70 hover:text-emerald-700 dark:text-parchment-100/60"
          >
            Hapus
          </button>
        )}
      </section>

      {/* Quick links */}
      <section className="grid gap-3 sm:grid-cols-3">
        <QuickTile
          href="#daftar"
          label="Daftar Surah"
          value={SURAH_LIST.length.toString()}
          accent="neon"
        />
        <QuickTile
          href="/mihrab/quran/bookmark"
          label="Bookmark"
          value={bookmarkCount.toString()}
          accent="amber"
        />
        <QuickTile
          href={lastRead ? `/mihrab/quran/${lastRead.surah}` : "#daftar"}
          label="Terakhir Dibuka"
          value={lastReadMeta ? lastReadMeta.namaLatin : "—"}
          accent="neon"
        />
      </section>

      {/* Recent */}
      {hydrated && recent.length > 0 && !query && (
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
            Baru Dibaca
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {recent.map((s) => (
              <Link
                key={s.nomor}
                href={`/mihrab/quran/${s.nomor}`}
                className="shrink-0 rounded-2xl border border-emerald-100 bg-parchment-50 px-3 py-2 text-sm text-emerald-700 hover:border-neon-400/50 hover:shadow-glow dark:border-emerald-900/60 dark:bg-space-900/60 dark:text-parchment-100"
              >
                <span className="font-semibold">{s.nomor}.</span>{" "}
                <span className="truncate">{s.namaLatin}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* List */}
      <section id="daftar" className="card p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
            Daftar Surah
          </h2>
          <span className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
            {filtered.length} hasil
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-emerald-700/70 dark:text-parchment-100/60">
            Tidak ada surah cocok dengan &quot;{query}&quot;.
          </p>
        ) : (
          <ul className="divide-y divide-emerald-100 dark:divide-emerald-900/60">
            {filtered.map((s) => (
              <li key={s.nomor}>
                <Link
                  href={`/mihrab/quran/${s.nomor}`}
                  className="flex min-w-0 items-center gap-3 py-3 transition hover:bg-parchment-50 dark:hover:bg-space-900/60 sm:gap-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-display font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
                    {s.nomor}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
                        {s.namaLatin}
                      </span>
                      <span className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
                        {s.arti} · {s.jumlahAyat} ayat ·{" "}
                        <span className="capitalize">{s.tempatTurun.toLowerCase()}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="arabic shrink-0 text-xl text-emerald-700 dark:text-neon-400 sm:text-2xl"
                    dir="rtl"
                  >
                    {s.nama}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function QuickTile({
  href,
  label,
  value,
  accent,
}: {
  href: string;
  label: string;
  value: string;
  accent: "neon" | "amber";
}) {
  const valueClass =
    accent === "amber" ? "text-glow-amber" : "text-glow-neon";
  return (
    <Link
      href={href}
      className="card relative min-w-0 overflow-hidden p-4 transition hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-400/10 blur-2xl" />
      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-neon-500/80">
        {label}
      </div>
      <div
        className={`mt-1 truncate font-display text-2xl font-bold sm:text-3xl ${valueClass}`}
      >
        {value}
      </div>
    </Link>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
