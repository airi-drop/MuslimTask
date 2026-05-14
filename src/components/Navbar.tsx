"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Statistik", href: "/statistik" },
  { label: "Achievement", href: "/achievement" },
  { label: "Spiritual", href: "/spiritual", hasDropdown: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [streak] = useState(0);

  return (
    <nav className="card flex flex-wrap items-center justify-between gap-4 px-5 py-3">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-700 text-cream-50">
          <MosqueIcon className="h-6 w-6" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-xl font-bold text-forest-800">
            Prayer Streak
          </div>
          <div className="text-[10px] font-semibold tracking-[0.2em] text-forest-500/70">
            HABIT IBADAH HARIAN
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <ul className="order-3 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto">
        {ITEMS.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`pill text-sm transition ${
                  active
                    ? "bg-forest-600 text-cream-50"
                    : "text-forest-700 hover:bg-cream-100"
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

      {/* Right side */}
      <div className="order-2 flex items-center gap-3 sm:order-3">
        <div className="pill border border-cream-200 bg-white text-forest-700">
          <FlameIcon className="h-4 w-4 text-gold-500" />
          <span className="font-semibold">{streak} Day Streak</span>
        </div>
        <button
          aria-label="Notifikasi"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-cream-200 bg-white text-forest-700 hover:bg-cream-100"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-cream-200 bg-white py-1 pl-1 pr-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-forest-100 font-semibold text-forest-700">
            A
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-forest-800">Admin</div>
            <div className="text-[10px] tracking-widest text-forest-500/70">
              AKUN
            </div>
          </div>
          <ChevronDownIcon className="h-3.5 w-3.5 text-forest-500/70" />
        </div>
      </div>
    </nav>
  );
}

/* ---------- Inline icons (no extra deps) ---------- */

function MosqueIcon({ className }: { className?: string }) {
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
      <path d="M12 2c2 2 3 4 3 6a3 3 0 1 1-6 0c0-2 1-4 3-6Z" />
      <path d="M4 21V12c0-3 3-5 8-5s8 2 8 5v9" />
      <path d="M4 21h16" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3 0 2 1 3 2 3 0-2-1-4 1-8Z" />
      <path d="M6 14a6 6 0 1 0 12 0c0-2-1-3-2-4 0 3-2 4-3 4 1-3-1-5-2-6-1 2-3 3-3 6Z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
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
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
