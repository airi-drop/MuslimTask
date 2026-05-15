"use client";

import { useEffect, useMemo, useState } from "react";
import {
  formatCountdown,
  formatTime,
  getNextPrayer,
  getPrayerTimes,
  humanizeCountdown,
  type PrayerSlot,
} from "@/lib/prayer";
import { formatGregorian, toHijri } from "@/lib/hijri";
import type { Location } from "@/lib/location";

type Props = {
  location: Location;
  onChangeLocation: () => void;
};

export function NextPrayerCard({ location, onChangeLocation }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next: PrayerSlot | null = useMemo(() => {
    if (!now) return null;
    return getNextPrayer(location, now);
  }, [location, now]);

  const todaySlots = useMemo(() => {
    if (!now) return [];
    return getPrayerTimes(location, now);
  }, [location, now]);

  if (!now || !next) {
    return (
      <div className="card-feature min-h-[420px] animate-pulse p-6">
        <div className="h-4 w-24 rounded bg-emerald-700/40" />
      </div>
    );
  }

  const remaining = next.time.getTime() - now.getTime();
  const greg = formatGregorian(now);
  const hijri = toHijri(now).formatted;
  const localTime = formatTime(now, location.timezone);

  return (
    <section className="card-feature relative h-full overflow-hidden p-5 sm:p-6">
      {/* Decorative crescent & glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />
      <CrescentDecoration className="pointer-events-none absolute right-3 top-3 h-16 w-16 text-amber-300/80 sm:h-20 sm:w-20" />

      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-400">
          Shalat Berikutnya
        </div>
        <h2 className="mt-1 font-display text-4xl font-bold leading-tight text-parchment-50 sm:text-5xl">
          {next.name}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-parchment-100/80">{greg}</span>
          <span
            className="rounded-full bg-emerald-950/50 px-2.5 py-0.5 text-xs text-parchment-100/90 ring-1 ring-emerald-800/50"
            title="Hijriah dihitung dengan kalender Umm Al-Qura (hisab). Bisa berbeda 1 hari dari rukyat resmi Kemenag."
          >
            {hijri}
          </span>
        </div>
        <div className="mt-1 truncate text-sm text-parchment-100/70">
          {location.city}, {location.region}
        </div>
        {location.city === "Lokasi GPS" && (
          <p className="mt-1 text-[11px] text-amber-300/90">
            Nama lokasi belum bisa diambil — koneksi internet diperlukan untuk
            reverse geocoding. Jadwal salat tetap akurat dari koordinat GPS.
          </p>
        )}

        <button
          onClick={onChangeLocation}
          className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-950/50 px-4 py-2 text-sm font-medium text-parchment-50 ring-1 ring-emerald-800/60 transition hover:bg-emerald-900 hover:ring-neon-500/40"
        >
          <PinIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">Ganti Lokasi</span>
        </button>

        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-parchment-100/60">
            Waktu menuju {next.name.toLowerCase()}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-glow-amber font-display text-3xl font-bold tabular-nums sm:text-4xl">
              {formatCountdown(remaining)}
            </span>
          </div>
          <div className="text-sm text-parchment-100/70">
            {humanizeCountdown(remaining)}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="rounded-2xl bg-emerald-950/40 p-3 ring-1 ring-emerald-800/50 sm:p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-parchment-100/60">
              Waktu
            </div>
            <div className="mt-1 font-display text-xl font-bold tabular-nums sm:text-2xl">
              {localTime}
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-950/40 p-3 ring-1 ring-emerald-800/50 sm:p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-parchment-100/60">
              Status
            </div>
            <div className="mt-1 flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
              <span className="h-2 w-2 rounded-full bg-neon-400 animate-glow" />
              <span className="truncate">Berjalan</span>
            </div>
          </div>
        </div>

        {/* Today's schedule — chips */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {todaySlots.map((s) => (
            <div
              key={s.key}
              className={`min-w-0 rounded-xl px-1.5 py-2 text-center text-[11px] ring-1 transition ${
                s.key === next.key
                  ? "bg-amber-400/15 text-amber-300 ring-amber-400/30"
                  : "bg-emerald-950/30 text-parchment-100/80 ring-emerald-800/40"
              }`}
            >
              <div className="truncate font-semibold">{s.name}</div>
              <div className="truncate font-mono">
                {formatTime(s.time, location.timezone)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CrescentDecoration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <path
        d="M48 12c-11 0-20 9-20 20s9 20 20 20c2.4 0 4.7-.4 6.8-1.2A24 24 0 1 1 48 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  );
}
