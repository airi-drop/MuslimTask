"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DOA_CATEGORIES, DOA_LIST, type DoaCategory } from "@/lib/doa";

export function DoaList() {
  const [activeCategory, setActiveCategory] = useState<DoaCategory | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = DOA_LIST;
    if (activeCategory) {
      items = items.filter((d) => d.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.latin.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q) ||
          d.arabic.includes(q),
      );
    }
    return items;
  }, [activeCategory, search]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Doa Harian"
        title="Doa Harian"
        description="Kumpulan doa untuk aktivitas sehari-hari. Tersimpan offline — bisa dibuka kapan saja."
        back={{ href: "/mihrab", label: "Mihrab" }}
      />

      {/* Category chips */}
      <section className="card p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`pill text-xs transition ${
              activeCategory === null
                ? "bg-emerald-700 text-parchment-50 shadow-glow"
                : "border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
            }`}
          >
            Semua
          </button>
          {DOA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill text-xs transition ${
                activeCategory === cat
                  ? "bg-emerald-700 text-parchment-50 shadow-glow"
                  : "border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="mt-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari doa..."
            className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-emerald-800 placeholder:text-emerald-700/40 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50 dark:placeholder:text-parchment-100/40"
          />
        </div>
      </section>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-sm text-emerald-700/70 dark:text-parchment-100/60">
            Tidak ada doa yang cocok dengan pencarian.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {filtered.map((d) => (
            <article key={d.id} className="card min-w-0 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
                  {d.title}
                </h2>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
                  {d.category}
                </span>
              </div>
              <p
                className="arabic mt-3 break-words text-right text-xl text-emerald-700 dark:text-parchment-50 sm:text-2xl"
                dir="rtl"
              >
                {d.arabic}
              </p>
              <p className="mt-3 break-words text-sm italic text-emerald-700/80 dark:text-parchment-100/70">
                {d.latin}
              </p>
              <p className="mt-2 break-words text-sm text-emerald-800 dark:text-parchment-100/90">
                <span className="font-semibold">Artinya:</span> {d.translation}
              </p>
              {d.source && (
                <p className="mt-2 text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
                  {d.source}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
