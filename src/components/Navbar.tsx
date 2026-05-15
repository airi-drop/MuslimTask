"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMuslimState } from "@/lib/useMuslimState";
import { evaluateAll } from "@/lib/achievements";

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Quest", href: "/quest" },
  { label: "Tasbih", href: "/tasbih" },
  { label: "Mihrab", href: "/mihrab", hasDropdown: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { progress, quests } = useMuslimState();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  // Bell dot lights up when there are recently-unlocked badges that haven't
  // been viewed (= unlockedAchievements set size > seenAchievements size).
  // For now, we use a simpler signal: any unlocked achievement shows badge.
  const evaluated = evaluateAll(progress, quests);
  const unlockedCount = evaluated.filter((e) => e.unlocked).length;

  return (
    <nav className="card flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5 sm:py-3">
      <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow sm:h-11 sm:w-11">
          <CrescentLogo className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-400 animate-glow" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate font-display text-lg font-bold tracking-tight text-emerald-800 dark:text-parchment-50 sm:text-xl">
            MuslimTask
          </div>
          <div className="truncate text-[10px] font-semibold tracking-[0.2em] text-emerald-600/70 dark:text-neon-500/70">
            QUEST IBADAH HARIAN
          </div>
        </div>
      </Link>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="grid h-10 w-10 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-neon-400 sm:hidden"
      >
        <BurgerIcon className="h-5 w-5" />
      </button>

      <ul
        className={`order-3 w-full items-center justify-center gap-1 sm:order-2 sm:flex sm:w-auto ${
          open ? "flex flex-col" : "hidden sm:flex"
        }`}
      >
        {ITEMS.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="w-full sm:w-auto">
              <Link
                href={it.href}
                className={`pill w-full justify-center text-sm transition sm:w-auto ${
                  active
                    ? "bg-emerald-700 text-parchment-50 shadow-glow dark:bg-emerald-600"
                    : "text-emerald-700 hover:bg-parchment-50 dark:text-parchment-100 dark:hover:bg-space-900"
                }`}
              >
                {it.label}
                {it.hasDropdown && (
                  <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="order-2 flex shrink-0 items-center gap-2 sm:order-3 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 md:inline-flex">
          <FlameIcon className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold">{progress.streak} Hari</span>
        </div>
        <ThemeToggle />
        <Link
          href="/achievement"
          aria-label="Achievement"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
        >
          <BellIcon className="h-5 w-5" />
          {unlockedCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-emerald-950 shadow-glow-amber">
              {unlockedCount}
            </span>
          )}
        </Link>
        <Link
          href="/settings"
          aria-label="Pengaturan"
          className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white py-1 pl-1 pr-3 hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:hover:bg-space-900 lg:flex"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-neon-400">
            <GearIcon className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">
              Admin
            </div>
            <div className="text-[10px] tracking-widest text-emerald-600/70 dark:text-neon-500/70">
              PENGATURAN
            </div>
          </div>
        </Link>
        <Link
          href="/settings"
          aria-label="Pengaturan"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 lg:hidden"
        >
          <GearIcon className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
}

function CrescentLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4a8 8 0 1 0 4 14 6 6 0 0 1-4-14Z" fill="currentColor" opacity=".25" />
      <path d="M16 4a8 8 0 1 0 4 14 6 6 0 0 1-4-14Z" />
      <path d="m11 9 .8 1.7L13.5 11l-1.7.8L11 13.5 10.2 11.8 8.5 11l1.7-.3L11 9Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3 0 2 1 3 2 3 0-2-1-4 1-8Z" />
      <path d="M6 14a6 6 0 1 0 12 0c0-2-1-3-2-4 0 3-2 4-3 4 1-3-1-5-2-6-1 2-3 3-3 6Z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function BurgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </svg>
  );
}
