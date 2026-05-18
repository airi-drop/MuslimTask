"use client";

import Link from "next/link";
import { BookMarked, Sunrise, Sunset } from "lucide-react";

const SECTIONS = [
  {
    href: "/mihrab/quran",
    title: "Al-Quran",
    description: "Baca & bookmark surah. Tersimpan offline.",
    icon: BookMarked,
  },
  {
    href: "/mihrab/doa",
    title: "Doa Harian",
    description: "Kumpulan doa untuk aktivitas sehari-hari.",
    icon: Sunrise,
  },
  {
    href: "/mihrab/dzikir",
    title: "Dzikir",
    description: "Al-Ma'tsurat pagi & petang lengkap.",
    icon: Sunset,
  },
];

export default function MihrabHubPage() {
  return (
    <div className="px-5 py-6 pb-24">
      <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted">
        MIHRAB
      </p>
      <h1 className="font-display text-xl text-text-primary mt-1 mb-4">
        Konten Ibadah
      </h1>

      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-4 bg-bg-surface border border-text-ghost/30 rounded-xl p-4 active:scale-[0.97] transition-transform duration-75"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-main/10 border border-green-dim/40">
                <Icon size={20} className="text-green-light" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-medium text-text-primary">
                  {s.title}
                </p>
                <p className="font-sans text-[11px] text-text-muted mt-0.5">
                  {s.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
