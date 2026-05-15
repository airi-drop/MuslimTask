"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { clearAllBookmarks, flatBookmarks, type SurahMeta } from "@/lib/quran";
import { subscribeStorage } from "@/lib/storage";

type Item = { surah: SurahMeta; ayat: number };

export function BookmarkList() {
  const [items, setItems] = useState<Item[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const refresh = () => setItems(flatBookmarks());
    refresh();
    setHydrated(true);
    return subscribeStorage((key) => {
      if (key.startsWith("mt:quran")) refresh();
    });
  }, []);

  function handleClearAll() {
    clearAllBookmarks();
    setConfirming(false);
    setItems([]);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Al-Quran / Bookmark"
        title="Ayat Tersimpan"
        description="Ayat-ayat yang kamu tandai. Tap untuk kembali ke posisi bacaan."
        back={{ href: "/mihrab/quran", label: "Daftar Surah" }}
      />

      {hydrated && items.length > 0 && (
        <section className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-emerald-700/80 dark:text-parchment-100/70">
            {items.length} ayat tersimpan
          </p>
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 dark:text-amber-300">
                Yakin hapus semua?
              </span>
              <button
                onClick={handleClearAll}
                className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-emerald-950 hover:bg-amber-400"
              >
                Ya, hapus
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-400/20 dark:text-amber-300"
            >
              Hapus Semua
            </button>
          )}
        </section>
      )}

      <section className="card p-5 sm:p-6">
        {hydrated && items.length === 0 ? (
          <p className="py-8 text-center text-sm text-emerald-700/70 dark:text-parchment-100/60">
            Belum ada bookmark. Tap ikon bookmark di samping ayat untuk
            menyimpannya.
          </p>
        ) : (
          <ul className="divide-y divide-emerald-100 dark:divide-emerald-900/60">
            {items.map(({ surah, ayat }) => (
              <li key={`${surah.nomor}:${ayat}`}>
                <Link
                  href={`/mihrab/quran/${surah.nomor}#ayat-${ayat}`}
                  className="flex min-w-0 items-center gap-3 py-3 transition hover:bg-parchment-50 dark:hover:bg-space-900/60"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 font-display font-bold text-amber-600 dark:text-amber-300">
                    {surah.nomor}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display font-bold text-emerald-800 dark:text-parchment-50">
                      {surah.namaLatin}
                      <span className="ml-2 text-sm font-normal text-emerald-700/70 dark:text-parchment-100/60">
                        Ayat {ayat}
                      </span>
                    </div>
                    <div className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
                      {surah.arti} · {surah.jumlahAyat} ayat
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-emerald-700 dark:text-neon-400">
                    Buka →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

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
