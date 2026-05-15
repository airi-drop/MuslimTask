"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  SURAH_LIST,
  fetchSurah,
  isBookmarked,
  loadCachedSurah,
  pushRecent,
  saveLastRead,
  toggleBookmark,
  type SurahDetail,
  type SurahMeta,
} from "@/lib/quran";
import { addQuestXp, type Progress } from "@/lib/progress";
import {
  applyQuestState,
  getQuestState,
  DAILY_QUESTS,
  WEEKLY_QUESTS,
} from "@/lib/quests";
import { useMuslimState } from "@/lib/useMuslimState";

const QURAN_QUEST_DEF = DAILY_QUESTS.find((q) => q.id === "quran-1")!;
const KAHFI_QUEST_DEF = WEEKLY_QUESTS.find((q) => q.id === "al-kahfi-jumat")!;

type Props = { meta: SurahMeta };

export function SurahReader({ meta }: Props) {
  const { quests, setQuests, setProgress } = useMuslimState();
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [arabicSize, setArabicSize] = useState<"sm" | "md" | "lg">("md");
  const [showLatin, setShowLatin] = useState(true);
  const [bookmarkVersion, setBookmarkVersion] = useState(0);
  const claimedQuestRef = useRef(false);

  // Hydrate cached + push recent + register last-read tracking
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const cached = loadCachedSurah(meta.nomor);
    if (cached?.ayat?.length) {
      setDetail(cached);
      setLoading(false);
      pushRecent(meta.nomor);
    }

    fetchSurah(meta.nomor)
      .then((d) => {
        if (cancelled) return;
        setDetail(d);
        pushRecent(meta.nomor);
      })
      .catch((e) => {
        if (cancelled) return;
        if (!cached) {
          setError(
            e instanceof Error
              ? e.message
              : "Gagal memuat surah. Coba lagi saat online.",
          );
        }
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [meta.nomor]);

  // Auto-claim "Baca Al-Quran" daily quest the first time the user opens
  // a surah today. Also auto-claim Al-Kahfi quest if surah 18 on Friday.
  useEffect(() => {
    if (!detail || claimedQuestRef.current) return;

    const claimDaily = () => {
      const state = getQuestState(quests, QURAN_QUEST_DEF);
      if (state.done) return false;
      const next = {
        ...state,
        count: QURAN_QUEST_DEF.target,
        done: true,
        claimedAt: new Date().toISOString(),
      };
      setQuests((s) => applyQuestState(s, QURAN_QUEST_DEF, next));
      setProgress((p: Progress) => addQuestXp(p, QURAN_QUEST_DEF.xp));
      return true;
    };

    const claimKahfi = () => {
      const today = new Date();
      if (today.getDay() !== 5) return false; // 5 = Jumat
      if (meta.nomor !== 18) return false;
      const state = getQuestState(quests, KAHFI_QUEST_DEF);
      if (state.done) return false;
      const next = {
        ...state,
        count: KAHFI_QUEST_DEF.target,
        done: true,
        claimedAt: new Date().toISOString(),
      };
      setQuests((s) => applyQuestState(s, KAHFI_QUEST_DEF, next));
      setProgress((p: Progress) => addQuestXp(p, KAHFI_QUEST_DEF.xp));
      return true;
    };

    claimDaily();
    claimKahfi();
    claimedQuestRef.current = true;
  }, [detail, meta.nomor, quests, setQuests, setProgress]);

  // Scroll to hash target (e.g. #ayat-12)
  useEffect(() => {
    if (!detail || typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      // Defer to next tick so layout is stable.
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [detail]);

  // Persist last-read on first visible ayat as user scrolls.
  useEffect(() => {
    if (!detail) return;
    let lastSaved = -1;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ayat = Number(entry.target.getAttribute("data-ayat"));
            if (ayat && ayat !== lastSaved) {
              lastSaved = ayat;
              saveLastRead(meta.nomor, ayat);
            }
            break;
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-ayat]")
      .forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [detail, meta.nomor]);

  const prev = useMemo(
    () => SURAH_LIST.find((s) => s.nomor === meta.nomor - 1),
    [meta.nomor],
  );
  const next = useMemo(
    () => SURAH_LIST.find((s) => s.nomor === meta.nomor + 1),
    [meta.nomor],
  );

  const arabicClass =
    arabicSize === "lg" ? "text-3xl sm:text-4xl" : arabicSize === "sm" ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl";

  function bookmark(ayat: number) {
    toggleBookmark(meta.nomor, ayat);
    setBookmarkVersion((v) => v + 1);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow={`Mihrab / Al-Quran / Surah ${meta.nomor}`}
        title={`${meta.namaLatin} — ${meta.arti}`}
        description={`${meta.jumlahAyat} ayat · diturunkan di ${meta.tempatTurun}. Buka surah sekali saat online untuk menyimpannya offline secara otomatis.`}
        back={{ href: "/mihrab/quran", label: "Daftar Surah" }}
      />

      {/* Bismillah card (skip for At-Taubah) */}
      {meta.nomor !== 9 && meta.nomor !== 1 && (
        <div className="card p-5 text-center sm:p-6">
          <p
            className="arabic text-2xl text-emerald-700 dark:text-parchment-50 sm:text-3xl"
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-2 text-xs italic text-emerald-700/70 dark:text-parchment-100/70">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
          </p>
        </div>
      )}

      {/* Reader controls */}
      <section className="card flex flex-wrap items-center gap-2 p-3 sm:p-4">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/70 dark:text-parchment-100/60">
          Pengaturan
        </span>
        <div className="flex items-center gap-1 rounded-full bg-parchment-100 p-1 text-xs dark:bg-space-900">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setArabicSize(s)}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                arabicSize === s
                  ? "bg-emerald-700 text-parchment-50 shadow-glow"
                  : "text-emerald-700/70 dark:text-parchment-100/70"
              }`}
            >
              {s === "sm" ? "A-" : s === "md" ? "A" : "A+"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowLatin((v) => !v)}
          className={`pill text-xs transition ${
            showLatin
              ? "bg-emerald-700 text-parchment-50 shadow-glow"
              : "border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
          }`}
        >
          Latin
        </button>
      </section>

      {/* Body */}
      {error && !detail && (
        <div className="card p-6 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-300">{error}</p>
          <p className="mt-2 text-xs text-emerald-700/70 dark:text-parchment-100/60">
            Surah belum tersedia offline. Coba buka saat online sekali untuk menyimpannya.
          </p>
        </div>
      )}

      {!detail && loading && !error && (
        <div className="card animate-pulse p-6">
          <div className="h-4 w-24 rounded bg-emerald-100 dark:bg-emerald-900/60" />
          <div className="mt-4 h-12 w-full rounded bg-emerald-100 dark:bg-emerald-900/60" />
          <div className="mt-3 h-12 w-5/6 rounded bg-emerald-100 dark:bg-emerald-900/60" />
        </div>
      )}

      {detail && (
        <section className="space-y-3">
          {detail.ayat.map((a) => {
            const bm = isBookmarked(detail.nomor, a.nomorAyat);
            void bookmarkVersion; // keep dependency
            return (
              <article
                key={a.nomorAyat}
                id={`ayat-${a.nomorAyat}`}
                data-ayat={a.nomorAyat}
                className="card scroll-mt-20 p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 font-display text-sm font-bold text-parchment-50 shadow-glow">
                    {a.nomorAyat}
                  </div>
                  <button
                    onClick={() => bookmark(a.nomorAyat)}
                    aria-label={bm ? "Hapus bookmark" : "Tambah bookmark"}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
                      bm
                        ? "bg-amber-400 text-emerald-950 shadow-glow-amber"
                        : "border border-emerald-100 bg-white text-emerald-700/70 hover:text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
                    }`}
                  >
                    <BookmarkIcon className="h-4 w-4" filled={bm} />
                  </button>
                </div>
                <p
                  className={`arabic mt-3 break-words text-right leading-loose text-emerald-700 dark:text-parchment-50 ${arabicClass}`}
                  dir="rtl"
                >
                  {a.teksArab}
                </p>
                {showLatin && (
                  <p className="mt-3 break-words text-sm italic text-emerald-700/70 dark:text-parchment-100/70">
                    {a.teksLatin}
                  </p>
                )}
                <p className="mt-2 break-words text-sm text-emerald-800 dark:text-parchment-100/90">
                  {a.teksIndonesia}
                </p>
              </article>
            );
          })}
        </section>
      )}

      {/* Surah nav */}
      <nav className="grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/mihrab/quran/${prev.nomor}`}
            className="card flex min-w-0 items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
              ←
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/70 dark:text-parchment-100/60">
                Sebelumnya
              </div>
              <div className="truncate font-display font-bold text-emerald-800 dark:text-parchment-50">
                {prev.namaLatin}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/mihrab/quran/${next.nomor}`}
            className="card flex min-w-0 items-center justify-end gap-3 p-4 text-right transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700/70 dark:text-parchment-100/60">
                Selanjutnya
              </div>
              <div className="truncate font-display font-bold text-emerald-800 dark:text-parchment-50">
                {next.namaLatin}
              </div>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
              →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      <div className="text-center">
        <Link
          href="/mihrab/quran"
          className="text-sm font-semibold text-emerald-700 hover:underline dark:text-neon-400"
        >
          ← Kembali ke daftar surah
        </Link>
      </div>
    </div>
  );
}

function BookmarkIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  );
}
