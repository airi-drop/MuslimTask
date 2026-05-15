"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useMuslimState } from "@/lib/useMuslimState";
import { unclaimedAchievementCount } from "@/lib/progress";

/* ─── Bottom tab bar items (mobile) ─── */
type TabItem = {
  label: string;
  href: string;
  icon: (props: { className?: string; active?: boolean }) => JSX.Element;
  center?: boolean;
};

const TABS: TabItem[] = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Quest", href: "/quest", icon: QuestIcon },
  { label: "Tasbih", href: "/tasbih", icon: TasbihIcon, center: true },
  { label: "Statistik", href: "/statistik", icon: StatsIcon },
  { label: "Mihrab", href: "/mihrab", icon: MihrabIcon },
];

/* ─── Desktop top nav items ─── */
type NavItem = { label: string; href: string; hasDropdown?: boolean };

const DESKTOP_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Quest", href: "/quest" },
  { label: "Tasbih", href: "/tasbih" },
  { label: "Statistik", href: "/statistik" },
  { label: "Mihrab", href: "/mihrab", hasDropdown: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { progress } = useMuslimState();

  const unlockedCount = unclaimedAchievementCount(progress);

  return (
    <>
      {/* ═══════ DESKTOP TOP NAV (hidden on mobile) ═══════ */}
      <nav className="card hidden items-center justify-between gap-3 px-5 py-3 sm:flex">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
            <CrescentLogo className="h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-400 animate-glow" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-xl font-bold tracking-tight text-emerald-800 dark:text-parchment-50">
              MuslimTask
            </div>
            <div className="truncate text-[10px] font-semibold tracking-[0.2em] text-emerald-600/70 dark:text-neon-500/70">
              QUEST IBADAH HARIAN
            </div>
          </div>
        </Link>

        {/* Center nav pills */}
        <ul className="flex items-center gap-1">
          {DESKTOP_ITEMS.map((it) => {
            const active =
              it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`pill text-sm transition ${
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

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-3">
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

      {/* ═══════ MOBILE TOP BAR (minimal, sm:hidden) ═══════ */}
      <div className="card flex items-center justify-between px-3 py-2.5 sm:hidden">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50 shadow-glow">
            <CrescentLogo className="h-4 w-4" />
          </div>
          <span className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
            MuslimTask
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100">
            <FlameIcon className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-semibold">{progress.streak}</span>
          </div>
          <Link
            href="/achievement"
            aria-label="Achievement"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
          >
            <BellIcon className="h-4 w-4" />
            {unlockedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-[14px] place-items-center rounded-full bg-amber-400 px-0.5 text-[9px] font-bold text-emerald-950">
                {unlockedCount}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            aria-label="Pengaturan"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
          >
            <GearIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ═══════ MOBILE BOTTOM TAB BAR (fixed, sm:hidden) ═══════ */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
        <nav className="mx-3 mb-3 flex items-end justify-around rounded-2xl border border-emerald-100 bg-white/95 px-2 py-2 shadow-lg backdrop-blur-md dark:border-emerald-900/60 dark:bg-space-800/95">
          {TABS.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);

            if (tab.center) {
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`-mt-5 flex flex-col items-center gap-0.5 ${
                    active ? "" : ""
                  }`}
                >
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl shadow-lg transition ${
                      active
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-800 text-parchment-50 shadow-glow"
                        : "bg-gradient-to-br from-emerald-600 to-emerald-900 text-parchment-50/80"
                    }`}
                  >
                    <tab.icon className="h-6 w-6" active={active} />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      active
                        ? "text-emerald-700 dark:text-neon-400"
                        : "text-emerald-700/60 dark:text-parchment-100/50"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-0.5 py-1"
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-900/60"
                      : ""
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 transition ${
                      active
                        ? "text-emerald-700 dark:text-neon-400"
                        : "text-emerald-700/50 dark:text-parchment-100/40"
                    }`}
                    active={active}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    active
                      ? "text-emerald-700 dark:text-neon-400"
                      : "text-emerald-700/50 dark:text-parchment-100/40"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

/* ─── Tab Icons ─── */

function HomeIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5Z" />
      {!active && <path d="M9 21V14h6v7" />}
    </svg>
  );
}

function QuestIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      {!active && <><path d="m9 14 2 2 4-4" /></>}
    </svg>
  );
}

function TasbihIcon({ className }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  );
}

function StatsIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}

function MihrabIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V10a8 8 0 0 1 16 0v11" />
      <path d="M8 21v-5a4 4 0 0 1 8 0v5" />
      {!active && <path d="M12 7v2" />}
    </svg>
  );
}

/* ─── Shared Icons ─── */

function CrescentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </svg>
  );
}
