"use client";

import { useMemo, useState } from "react";
import { AchievementToast } from "@/components/AchievementToast";
import { LocationPicker } from "@/components/LocationPicker";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { ShareCardButton } from "@/components/ShareCardButton";
import { StatTile } from "@/components/StatTile";
import {
  DEFAULT_LOCATION,
  loadLocation,
  saveLocation,
  type Location,
} from "@/lib/location";
import {
  PRAYER_KEYS,
  TARGET_PRAYERS_PER_DAY,
  getTodayRecord,
  levelFromXp,
  markPrayer,
  unmarkPrayer,
  type PrayerKey,
} from "@/lib/progress";
import { formatGregorian, toHijri } from "@/lib/hijri";
import { useMuslimState } from "@/lib/useMuslimState";
import { useEffect } from "react";

const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: "Subuh",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export function Dashboard() {
  const {
    hydrated,
    progress,
    setProgress,
    unlockedNow,
    clearUnlockedNow,
  } = useMuslimState();

  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    setLocation(loadLocation());
  }, []);

  const today = useMemo(() => getTodayRecord(progress), [progress]);
  const { level, intoLevel, toNext } = levelFromXp(progress.totalXp);
  const prayedCount = today.prayers.length;
  const prayedPct = Math.round((prayedCount / TARGET_PRAYERS_PER_DAY) * 100);
  const remaining = Math.max(0, TARGET_PRAYERS_PER_DAY - prayedCount);
  const xpPct = Math.min(100, intoLevel);

  function pickLocation(loc: Location) {
    setLocation(loc);
    saveLocation(loc);
  }

  function togglePrayer(key: PrayerKey) {
    setProgress((p) => {
      const todayRec = getTodayRecord(p);
      return todayRec.prayers.includes(key)
        ? unmarkPrayer(p, key)
        : markPrayer(p, key);
    });
  }

  return (
    <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
      <AchievementToast ids={unlockedNow} onDismiss={clearUnlockedNow} />

      {/* HERO */}
      <section className="card-feature relative col-span-full overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-neon-500/30 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        </div>
        <GeometricStar className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-amber-400/30 animate-spin-slow sm:-right-2 sm:-top-2 sm:h-56 sm:w-56" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neon-400">
              Assalamu&apos;alaikum, Musafir
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-parchment-50 sm:text-4xl lg:text-5xl">
              Dashboard <span className="text-neon-400">Harian</span>
            </h1>
            <p className="mt-2 max-w-md text-sm text-parchment-100/80">
              Selesaikan quest ibadahmu hari ini. Kumpulkan XP, naik level, dan jaga streak-mu.
            </p>

            <div className="mt-3">
              <ShareCardButton
                data={() => ({
                  username: "Musafir",
                  streak: progress.streak,
                  bestStreak: progress.bestStreak,
                  level,
                  totalXp: progress.totalXp,
                  todayXp: progress.todayXp,
                  prayedCount,
                  prayerTarget: TARGET_PRAYERS_PER_DAY,
                  hijri: toHijri(new Date()).formatted,
                  gregorian: formatGregorian(new Date()),
                })}
                className="!bg-emerald-950/40 !text-parchment-50 !border-emerald-800/60 hover:!bg-emerald-900"
                label="Bagikan Progressku"
              />
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-emerald-950/40 p-3 ring-1 ring-emerald-800/60 backdrop-blur sm:p-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-display text-lg font-bold text-emerald-950 shadow-glow-amber sm:h-14 sm:w-14 sm:text-xl">
                Lv {level}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-xs text-parchment-100/80">
                  <span className="truncate">XP Level {level}</span>
                  <span className="shrink-0">
                    <span className="text-glow-neon font-display font-bold">
                      {intoLevel}
                    </span>
                    <span className="text-parchment-100/50"> / 100</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-emerald-950/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-500 to-neon-400 transition-all"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <p className="mt-1.5 truncate text-[11px] text-parchment-100/60">
                  {toNext} XP lagi untuk Level {level + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <HeroMetric
              icon={<FlameIcon className="h-5 w-5" />}
              label="Streak"
              value={progress.streak}
              suffix="hari"
              accent="amber"
            />
            <HeroMetric
              icon={<ShieldIcon className="h-5 w-5" />}
              label="Nyawa"
              value={progress.lives}
              suffix={`/ 3`}
              accent="neon"
            />
            <HeroMetric
              icon={<TrophyIcon className="h-5 w-5" />}
              label="Terbaik"
              value={progress.bestStreak}
              suffix="hari"
              accent="amber"
            />
          </div>
        </div>
      </section>

      {/* LEFT bento */}
      <section className="card relative col-span-full overflow-hidden p-5 sm:p-6 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-2 text-sm">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600/70 dark:text-neon-500/70">
                Quest Utama
              </div>
              <div className="font-display text-xl font-bold text-emerald-800 dark:text-parchment-50">
                Target 5 Salat
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-emerald-800 dark:text-parchment-50">
                {prayedPct}%
              </div>
              <div className="text-xs text-emerald-700/70 dark:text-parchment-100/70">
                {remaining > 0
                  ? `${remaining} salat lagi`
                  : "Target tercapai!"}
              </div>
            </div>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-neon-400 transition-all"
              style={{ width: `${prayedPct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <StatTile
            label="XP Hari Ini"
            value={
              <span>
                {progress.todayXp}
                <span className="ml-1 text-sm">XP</span>
              </span>
            }
            icon={<BoltIcon className="h-3.5 w-3.5" />}
            accent="amber"
          />
          <StatTile
            label="Level"
            value={level}
            icon={<LayersIcon className="h-3.5 w-3.5" />}
            accent="neon"
          />
          <StatTile
            label="Salat"
            value={`${prayedCount}/${TARGET_PRAYERS_PER_DAY}`}
            icon={<CheckIcon className="h-3.5 w-3.5" />}
          />
          <StatTile
            label="Total XP"
            value={
              <span>
                {progress.totalXp}
                <span className="ml-1 text-sm">XP</span>
              </span>
            }
            icon={<StarIcon className="h-3.5 w-3.5" />}
            accent="amber"
          />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
              Quest Salat 5 Waktu
            </h4>
            <span className="text-[11px] text-emerald-700/70 dark:text-parchment-100/60 sm:text-xs">
              Tap untuk klaim XP
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {PRAYER_KEYS.map((key) => {
              const done = today.prayers.includes(key);
              return (
                <button
                  key={key}
                  disabled={!hydrated}
                  onClick={() => togglePrayer(key)}
                  className={`group flex min-w-0 items-center justify-between gap-2 rounded-2xl border px-3 py-3 text-left transition ${
                    done
                      ? "border-neon-500/60 bg-gradient-to-br from-emerald-700 to-emerald-900 text-parchment-50 shadow-glow"
                      : "border-emerald-100 bg-parchment-50 text-emerald-800 hover:border-emerald-200 hover:bg-white dark:border-emerald-900/60 dark:bg-space-900/60 dark:text-parchment-100 dark:hover:border-neon-500/40"
                  } ${!hydrated ? "opacity-60" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {PRAYER_LABELS[key]}
                    </div>
                    <div
                      className={`truncate text-[11px] ${
                        done
                          ? "text-neon-400"
                          : "text-emerald-700/70 dark:text-parchment-100/60"
                      }`}
                    >
                      {done ? "+10 XP klaim" : "Belum klaim"}
                    </div>
                  </div>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition ${
                      done
                        ? "bg-neon-400 text-emerald-950"
                        : "bg-parchment-100 text-emerald-700/40 dark:bg-space-800 dark:text-parchment-100/30"
                    }`}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="col-span-full lg:col-span-5">
        <NextPrayerCard
          location={location}
          onChangeLocation={() => setPickerOpen(true)}
        />
      </div>

      <section className="card col-span-full p-5 sm:p-6">
        <StreakProtectionInner
          lives={progress.lives}
          streak={progress.streak}
        />
      </section>

      <LocationPicker
        open={pickerOpen}
        current={location}
        onClose={() => setPickerOpen(false)}
        onPick={pickLocation}
      />
    </div>
  );
}

/* ------------------------------------------------------------ */

function HeroMetric({
  icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  accent: "amber" | "neon";
}) {
  const valueClass =
    accent === "amber" ? "text-glow-amber" : "text-glow-neon";
  const iconClass =
    accent === "amber"
      ? "bg-amber-400/20 text-amber-300"
      : "bg-neon-500/20 text-neon-400";
  return (
    <div className="min-w-0 rounded-2xl bg-emerald-950/40 p-3 ring-1 ring-emerald-800/60 backdrop-blur">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${iconClass}`}>
        {icon}
      </div>
      <div className="mt-2 truncate text-[10px] font-semibold uppercase tracking-widest text-parchment-100/60">
        {label}
      </div>
      <div className={`font-display text-2xl font-bold sm:text-3xl ${valueClass}`}>
        {value}
      </div>
      <div className="truncate text-[10px] text-parchment-100/60">{suffix}</div>
    </div>
  );
}

function StreakProtectionInner({
  lives,
  streak,
}: {
  lives: number;
  streak: number;
}) {
  const nextLifeIn = streak === 0 ? 7 : 7 - (streak % 7 || 7);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
          <ShieldIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600/70 dark:text-neon-500/70">
            Streak Protection
          </div>
          <h3 className="font-display text-xl font-bold text-emerald-800 dark:text-parchment-50 sm:text-2xl">
            Nyawa Streak
          </h3>
          <p className="mt-1 max-w-md text-sm text-emerald-700/80 dark:text-parchment-100/70">
            {lives > 0
              ? `Kamu punya ${lives} nyawa untuk menyelamatkan streak.`
              : "Selesaikan 7 hari berturut-turut untuk dapat 1 nyawa."}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full transition ${
                i < lives
                  ? "bg-amber-400 shadow-glow-amber"
                  : "bg-parchment-200 dark:bg-space-900"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
          Nyawa berikutnya dalam {nextLifeIn} hari
        </div>
      </div>
    </div>
  );
}

/* ------- decorative SVG ------- */

function GeometricStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <g stroke="currentColor" strokeWidth="1" opacity="0.9">
        <path d="M50 5 65 35 95 50 65 65 50 95 35 65 5 50 35 35Z" />
        <path d="M50 15 60 40 85 50 60 60 50 85 40 60 15 50 40 40Z" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="35" />
      </g>
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
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 3 7 7 .8-5.2 4.7L18.5 22 12 18l-6.5 4 1.7-7.5L2 9.8 9 9l3-7Z" />
    </svg>
  );
}
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3" />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
