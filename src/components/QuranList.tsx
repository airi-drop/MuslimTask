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
import {
  QARI_LABEL,
  loadSettings,
  saveSettings,
  type Qari,
  type Settings,
} from "@/lib/settings";
import { subscribeStorage } from "@/lib/storage";
import { useT } from "@/lib/i18n";

export function QuranList() {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<SurahMeta[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const refresh = () => {
      setRecent(loadRecent());
      setLastRead(loadLastRead());
      setBookmarkCount(flatBookmarks().length);
      setSettings(loadSettings());
    };
    refresh();
    setHydrated(true);
    return subscribeStorage((key) => {
      if (key.startsWith("mt:quran") || key === "mt:settings") refresh();
    });
  }, []);

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    if (!settings) return;
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  }

  const filtered = useMemo(() => searchSurah(query), [query]);

  const lastReadMeta = lastRead
    ? SURAH_LIST.find((s) => s.nomor === lastRead.surah)
    : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow={t("quran.eyebrow")}
        title={t("quran.title")}
        description={t("quran.description")}
        back={{ href: "/mihrab", label: t("nav.mihrab") }}
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
              {t("quran.lastRead")}
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
            →
          </span>
        </Link>
      )}

      {/* Quran-specific reader settings */}
      {hydrated && settings && (
        <section className="card p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-sm font-bold text-emerald-800 dark:text-parchment-50">
                {t("quran.readerSettings")}
              </h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700/70 dark:text-parchment-100/60">
                {t("quran.qariLabel")}
              </span>
              <select
                value={settings.qari}
                onChange={(e) => updateSetting("qari", e.target.value as Qari)}
                className="mt-1 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
              >
                {(Object.keys(QARI_LABEL) as Qari[]).map((q) => (
                  <option key={q} value={q}>
                    {QARI_LABEL[q]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-parchment-50/50 px-3 py-2 dark:border-emerald-900/60 dark:bg-space-900/40">
              <span className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">
                {t("quran.showLatin")}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showLatin}
                onClick={() => updateSetting("showLatin", !settings.showLatin)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  settings.showLatin
                    ? "bg-gradient-to-r from-emerald-500 to-neon-400 shadow-glow"
                    : "bg-parchment-200 dark:bg-space-800"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    settings.showLatin ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <section className="card flex items-center gap-3 px-4 py-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-emerald-700/70 dark:text-neon-500/70" />
        <input
          type="search"
          inputMode="search"
          placeholder={t("quran.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-emerald-800 placeholder:text-emerald-700/40 focus:outline-none dark:text-parchment-50 dark:placeholder:text-parchment-100/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs font-semibold text-emerald-700/70 hover:text-emerald-700 dark:text-parchment-100/60"
          >
            ×
          </button>
        )}
      </section>

      {/* Quick links */}
      <section className="grid gap-3 sm:grid-cols-3">
        <QuickTile
          href="#daftar"
          label={t("quran.allSurah")}
          value={SURAH_LIST.length.toString()}
          accent="neon"
        />
        <QuickTile
          href="/mihrab/quran/bookmark"
          label={t("quran.bookmark")}
          value={bookmarkCount.toString()}
          accent="amber"
        />
        <QuickTile
          href={lastRead ? `/mihrab/quran/${lastRead.surah}` : "#daftar"}
          label={t("quran.lastRead")}
          value={lastReadMeta ? lastReadMeta.namaLatin : "—"}
          accent="neon"
        />
      </section>

      {/* Recent */}
      {hydrated && recent.length > 0 && !query && (
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
            {t("quran.recent")}
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
            {t("quran.allSurah")}
          </h2>
          <span className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
            {filtered.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-emerald-700/70 dark:text-parchment-100/60">
            &quot;{query}&quot;
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
                        {s.arti} · {s.jumlahAyat} ·{" "}
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </svg>
  );
}
