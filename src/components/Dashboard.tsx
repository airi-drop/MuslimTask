"use client";

import { useEffect, useMemo, useState } from "react";
import { LocationPicker } from "@/components/LocationPicker";
import { NextPrayerCard } from "@/components/NextPrayerCard";
import { StatTile } from "@/components/StatTile";
import {
  DEFAULT_LOCATION,
  loadLocation,
  saveLocation,
  type Location,
} from "@/lib/location";
import {
  TARGET_PRAYERS_PER_DAY,
  getTodayRecord,
  levelFromXp,
  loadProgress,
  type Progress,
  EMPTY_PROGRESS,
} from "@/lib/progress";

export function Dashboard() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setLocation(loadLocation());
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  const today = useMemo(() => getTodayRecord(progress), [progress]);
  const { level } = levelFromXp(progress.totalXp);
  const prayedCount = today.prayers.length;
  const prayedPct = Math.round(
    (prayedCount / TARGET_PRAYERS_PER_DAY) * 100,
  );
  const remaining = Math.max(0, TARGET_PRAYERS_PER_DAY - prayedCount);

  function pickLocation(loc: Location) {
    setLocation(loc);
    saveLocation(loc);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      {/* LEFT — Daily summary */}
      <section className="card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-forest-500/80">Assalamu&apos;alaikum, Admin</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-forest-800 sm:text-5xl">
              Dashboard Harian
            </h1>
            <p className="mt-2 text-sm text-forest-500/90">
              Catat dan jaga konsistensi salatmu setiap hari.
            </p>
          </div>

          <StreakBadge value={progress.streak} best={progress.bestStreak} />
        </div>

        {/* Target progress */}
        <div className="mt-7">
          <div className="flex items-end justify-between text-sm">
            <div className="font-semibold text-forest-800">Target 5 Salat</div>
            <div className="text-forest-500/90">
              <span className="font-bold text-forest-700">{prayedPct}%</span>{" "}
              {remaining > 0
                ? `${remaining} salat lagi untuk menyelesaikan target hari ini.`
                : "Target hari ini tercapai. MasyaAllah!"}
            </div>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-forest-600 transition-all"
              style={{ width: `${prayedPct}%` }}
            />
          </div>
        </div>

        {/* 4 stat tiles */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="XP Hari Ini"
            value={
              <span>
                {today.xp} <span className="text-base">XP</span>
              </span>
            }
            icon={<BoltIcon className="h-4 w-4" />}
            accent="gold"
          />
          <StatTile
            label="Level"
            value={level}
            icon={<LayersIcon className="h-4 w-4" />}
          />
          <StatTile
            label="Salat Terlaksana"
            value={`${prayedCount} / ${TARGET_PRAYERS_PER_DAY}`}
            icon={<CheckIcon className="h-4 w-4" />}
          />
          <StatTile
            label="Total XP"
            value={
              <span>
                {progress.totalXp} <span className="text-base">XP</span>
              </span>
            }
            icon={<StarIcon className="h-4 w-4" />}
            accent="gold"
          />
        </div>

        {/* Quick salat checklist */}
        <DailyChecklist
          progress={progress}
          onChange={setProgress}
          disabled={!hydrated}
        />
      </section>

      {/* RIGHT — Next prayer + Streak protection */}
      <div className="flex flex-col gap-5">
        <NextPrayerCard
          location={location}
          onChangeLocation={() => setPickerOpen(true)}
        />
        <StreakProtectionCard lives={progress.lives} streak={progress.streak} />
      </div>

      <LocationPicker
        open={pickerOpen}
        current={location}
        onClose={() => setPickerOpen(false)}
        onPick={pickLocation}
      />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StreakBadge({ value, best }: { value: number; best: number }) {
  return (
    <div className="flex w-full max-w-[180px] flex-col items-center rounded-2xl border border-cream-200/80 bg-cream-50 p-4 text-center">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/15 text-gold-500">
        <FlameIcon className="h-4 w-4" />
      </div>
      <div className="mt-1 text-xs font-semibold text-forest-700/80">
        Streak-mu
      </div>
      <div className="font-display text-5xl font-bold text-forest-800">
        {value}
      </div>
      <div className="text-xs text-forest-500/80">hari</div>
      <div className="mt-1 rounded-full bg-cream-200/70 px-2.5 py-0.5 text-[11px] text-forest-600">
        Terbaik: {best} hari
      </div>
    </div>
  );
}

function StreakProtectionCard({
  lives,
  streak,
}: {
  lives: number;
  streak: number;
}) {
  const nextLifeIn = 7 - (streak % 7 || 0);
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-500/70">
            Streak Protection
          </div>
          <h3 className="font-display text-2xl font-bold text-forest-800">
            Nyawa Streak
          </h3>
          <p className="mt-1 text-sm text-forest-500/90">
            {lives > 0
              ? `Kamu punya ${lives} nyawa untuk menyelamatkan streak.`
              : "Selesaikan 7 hari berturut-turut untuk dapat 1 nyawa."}
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
          <ShieldIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < lives ? "bg-gold-500" : "bg-cream-200"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-forest-500/80">
          Nyawa berikutnya dalam {nextLifeIn} hari
        </div>
      </div>
    </section>
  );
}

function DailyChecklist({
  progress,
  onChange,
  disabled,
}: {
  progress: Progress;
  onChange: (p: Progress) => void;
  disabled?: boolean;
}) {
  const today = getTodayRecord(progress);
  const items = [
    { key: "fajr", name: "Subuh" },
    { key: "dhuhr", name: "Dzuhur" },
    { key: "asr", name: "Ashar" },
    { key: "maghrib", name: "Maghrib" },
    { key: "isha", name: "Isya" },
  ] as const;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-lg font-bold text-forest-800">
          Quest Harian — 5 Waktu Salat
        </h4>
        <span className="text-xs text-forest-500/80">
          Tap untuk tandai selesai
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {items.map((it) => {
          const done = today.prayers.includes(it.key);
          return (
            <button
              key={it.key}
              disabled={disabled}
              onClick={() => {
                // Toggle locally — saving wired up in next iteration.
                // For scaffold demo, optimistic in-memory update only.
                const nextPrayers = done
                  ? today.prayers.filter((p) => p !== it.key)
                  : [...today.prayers, it.key];
                const xpDelta = (done ? -1 : 1) * 10;
                const newToday = {
                  ...today,
                  prayers: nextPrayers,
                  xp: Math.max(0, today.xp + xpDelta),
                };
                onChange({
                  ...progress,
                  todayXp: Math.max(0, progress.todayXp + xpDelta),
                  totalXp: Math.max(0, progress.totalXp + xpDelta),
                  history: { ...progress.history, [today.date]: newToday },
                });
              }}
              className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                done
                  ? "border-forest-600 bg-forest-600 text-cream-50"
                  : "border-cream-200 bg-white text-forest-700 hover:bg-cream-50"
              } ${disabled ? "opacity-60" : ""}`}
            >
              <div>
                <div className="text-sm font-semibold">{it.name}</div>
                <div
                  className={`text-[11px] ${
                    done ? "text-cream-100/80" : "text-forest-500/80"
                  }`}
                >
                  {done ? "+10 XP" : "Belum"}
                </div>
              </div>
              <span
                className={`grid h-6 w-6 place-items-center rounded-full ${
                  done
                    ? "bg-cream-50 text-forest-700"
                    : "bg-cream-100 text-forest-500/60"
                }`}
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */

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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
