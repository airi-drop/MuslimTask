"use client";

import Link from "next/link";
import {
  Circle,
  Sunrise,
  Sunset,
  BookOpen,
  BookMarked,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ibadahItems = [
  {
    title: "Tasbih",
    subtitle: "Dzikir & counter digital",
    href: "/tasbih",
    icon: Circle,
    disabled: false,
  },
  {
    title: "Dzikir Pagi",
    subtitle: "Al-Ma'tsurat pagi",
    href: "/mihrab/dzikir",
    icon: Sunrise,
    disabled: false,
  },
  {
    title: "Dzikir Petang",
    subtitle: "Al-Ma'tsurat petang",
    href: "/mihrab/dzikir",
    icon: Sunset,
    disabled: false,
  },
  {
    title: "Doa Harian",
    subtitle: "Kumpulan doa sehari-hari",
    href: "/mihrab/doa",
    icon: BookOpen,
    disabled: false,
  },
  {
    title: "Al-Quran",
    subtitle: "Baca & bookmark surah",
    href: "/mihrab/quran",
    icon: BookMarked,
    disabled: false,
  },
  {
    title: "Asmaul Husna",
    subtitle: "Segera hadir",
    href: "#",
    icon: Star,
    disabled: true,
  },
];

export default function IbadahPage() {
  return (
    <div className="px-5 py-6">
      <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted">
        IBADAH
      </p>
      <h1 className="font-display text-xl text-text-primary mt-1">
        Konten Ibadah
      </h1>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {ibadahItems.map((item) => {
          const Icon = item.icon;

          const cardContent = (
            <div
              className={cn(
                "bg-bg-surface border border-text-ghost/30 rounded-xl p-4 min-h-[100px] flex flex-col justify-between",
                "active:scale-[0.97] transition-transform duration-75",
                item.disabled && "opacity-40 pointer-events-none"
              )}
            >
              <Icon size={20} className="text-text-secondary" />
              <div className="mt-auto">
                <p className="font-sans text-sm font-medium text-text-primary">
                  {item.title}
                </p>
                <p className="font-sans text-[10px] text-text-muted">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );

          if (item.disabled) {
            return (
              <div key={item.title} aria-disabled="true">
                {cardContent}
              </div>
            );
          }

          return (
            <Link key={item.title} href={item.href}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
