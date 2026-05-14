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

  // Initialize on client only — avoids hydration mismatch with localized time.
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
      <div className="card-dark min-h-[420px] animate-pulse p-6">
        <div className="h-4 w-24 rounded bg-forest-600/60" />
      </div>
    );
  }

  const remaining = next.time.getTime() - now.getTime();
  const greg = formatGregorian(now);
  const hijri = toHijri(now).formatted;
  const localTime = formatTime(now, location.timezone);

  return (
    <section className="card-dark relative overflow-hidden p-6">
      {/* Decorative crescent */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />
      <CrescentDecoration className="pointer-events-none absolute right-4 top-4 h-20 w-20 text-gold-400/90" />

      <div className="text-sm text-cream-100/80">Shalat Berikutnya</div>
      <h2 className="mt-1 font-display text-5xl font-bold leading-tight">
        {next.name}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-cream-100/80">{greg}</span>
        <span className="rounded-full bg-forest-600/60 px-2.5 py-0.5 text-xs text-cream-100/90">
          {hijri}
        </span>
      </div>
      <div className="mt-1 text-sm text-cream-100/80">
        {location.city}, {location.region}
      </div>

      <button
        onClick={onChangeLocation}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-600/60 px-4 py-2 text-sm font-medium text-cream-50 hover:bg-forest-600"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
          <circle cx="12" cy="9" r="3" />
        </svg>
        Ganti Lokasi
      </button>

      <div className="mt-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-100/60">
          Waktu menuju {next.name.toLowerCase()}
        </div>
        <div className="mt-1 font-display text-4xl font-bold text-gold-400">
          {formatCountdown(remaining)}
        </div>
        <div className="text-sm text-cream-100/80">
          {humanizeCountdown(remaining)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-forest-600/50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-cream-100/60">
            Waktu
          </div>
          <div className="mt-1 font-display text-2xl font-bold">
            {localTime}
          </div>
        </div>
        <div className="rounded-2xl bg-forest-600/50 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-cream-100/60">
            Status
          </div>
          <div className="mt-1 font-display text-2xl font-bold">Berjalan</div>
        </div>
      </div>

      {/* Compact today's schedule */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {todaySlots.map((s) => (
          <div
            key={s.key}
            className={`rounded-xl px-2 py-2 text-center text-xs ${
              s.key === next.key
                ? "bg-gold-500/20 text-gold-400"
                : "bg-forest-600/40 text-cream-100/80"
            }`}
          >
            <div className="font-semibold">{s.name}</div>
            <div className="font-mono">
              {formatTime(s.time, location.timezone)}
            </div>
          </div>
        ))}
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
