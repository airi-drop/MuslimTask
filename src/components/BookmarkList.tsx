"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { flatBookmarks, type SurahMeta } from "@/lib/quran";
import { subscribeStorage } from "@/lib/storage";

type Item = { surah: SurahMeta; ayat: number };

export function BookmarkList() {
  const [items, setItems] = useState<Item[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setItems(flatBookmarks());
    refresh();
    setHydrated(true);
    return subscribeStorage((key) => {
      if (key.startsWith("mt:quran")) refresh();
    });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Al-Quran / Bookmark"
        title="Ayat Tersimpan"
        description="Ayat-ayat yang kamu tandai. Tap untuk kembali ke posisi bacaan."
      />

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
