'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  loadProgress,
  getTodayRecord,
  levelFromXp,
  PRAYER_KEYS,
  type Progress,
  type DayRecord,
} from '@/lib/progress';
import { loadSettings, displayName } from '@/lib/settings';
import { loadLocation, type Location } from '@/lib/location';
import {
  getPrayerTimes,
  getNextPrayer,
  formatTime,
  formatCountdown,
  type PrayerSlot,
} from '@/lib/prayer';

/* ─── Rank helper ─── */
function getRankInfo(level: number): { emoji: string; name: string } {
  if (level >= 20) return { emoji: '👑', name: 'Wali Ibadah' };
  if (level >= 15) return { emoji: '💪', name: 'Hafiz Istiqamah' };
  if (level >= 10) return { emoji: '🔥', name: 'Mujahid Ruhani' };
  if (level >= 5) return { emoji: '⭐', name: 'Murid Setia' };
  return { emoji: '🌱', name: 'Musafir' };
}

/* ─── Prayer chip state ─── */
type ChipState = 'done' | 'current' | 'upcoming';

function getChipState(
  slot: PrayerSlot,
  now: Date,
  nextPrayer: PrayerSlot,
  claimed: string[],
): ChipState {
  if (claimed.includes(slot.key)) return 'done';
  if (slot.key === nextPrayer.key && slot.time.getTime() <= now.getTime()) return 'current';
  if (slot.key === nextPrayer.key) return 'current';
  if (slot.time.getTime() <= now.getTime()) return 'upcoming'; // passed but not claimed
  return 'upcoming';
}

const chipStyles: Record<ChipState, string> = {
  done: 'border-green-dim/60 bg-green-main/10',
  current: 'border-gold-main bg-gold-main/8 animate-pulse-gold',
  upcoming: 'border-text-ghost/30 bg-bg-surface',
};

const chipNameStyles: Record<ChipState, string> = {
  done: 'text-green-mid',
  current: 'text-gold-light',
  upcoming: 'text-text-muted',
};

const chipDotStyles: Record<ChipState, string> = {
  done: 'bg-green-main',
  current: 'bg-gold-main',
  upcoming: 'border border-text-ghost',
};

export default function BerandaPage() {
  const [now, setNow] = useState(() => new Date());
  const [progress, setProgress] = useState<Progress | null>(null);
  const [name, setName] = useState('Musafir');
  const [location, setLocation] = useState<Location | null>(null);

  /* ─── Load data from localStorage ─── */
  useEffect(() => {
    setProgress(loadProgress());
    const settings = loadSettings();
    setName(displayName(settings));
    setLocation(loadLocation());
  }, []);

  /* ─── Real-time clock ─── */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ─── Derived data ─── */
  const dateKey = now.toDateString();

  const prayerSlots = useMemo(() => {
    if (!location) return [];
    return getPrayerTimes(location, now).filter((s) => s.obligatory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dateKey]);

  const nextPrayer = useMemo(() => {
    if (!location) return null;
    return getNextPrayer(location, now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, dateKey]);

  const todayRecord: DayRecord | null = useMemo(() => {
    if (!progress) return null;
    return getTodayRecord(progress);
  }, [progress]);

  const claimed = useMemo(() => todayRecord?.prayers ?? [], [todayRecord]);
  const streak = progress?.streak ?? 0;
  const todayXp = progress?.todayXp ?? 0;
  const totalXp = progress?.totalXp ?? 0;
  const { level } = levelFromXp(totalXp);
  const rank = getRankInfo(level);

  /* ─── Countdown ─── */
  const countdownMs = nextPrayer ? nextPrayer.time.getTime() - now.getTime() : 0;
  const prayerHasPassed = nextPrayer ? now.getTime() > nextPrayer.time.getTime() : false;

  /* ─── Window tepat (10 min from prayer time) ─── */
  const windowMinutes = useMemo(() => {
    if (!nextPrayer || !prayerHasPassed) return 10;
    const elapsed = Math.floor((now.getTime() - nextPrayer.time.getTime()) / 60000);
    return Math.max(0, 10 - elapsed);
  }, [nextPrayer, now, prayerHasPassed]);

  /* ─── Quest items ─── */
  const questItems = useMemo(() => {
    const obligatory = PRAYER_KEYS.map((key) => ({
      key,
      name: key === 'fajr' ? 'Subuh' : key === 'dhuhr' ? 'Dzuhur' : key === 'asr' ? 'Ashar' : key === 'maghrib' ? 'Maghrib' : 'Isya',
      done: claimed.includes(key),
      xp: 10,
    }));
    // Prioritize incomplete, then show up to 3
    const sorted = [...obligatory].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
    return sorted.slice(0, 3);
  }, [claimed]);

  const questDone = claimed.length;

  /* ─── Loading state ─── */
  if (!progress || !location || !nextPrayer) {
    return (
      <div className="px-5 py-4 min-h-screen flex items-center justify-center">
        <p className="font-ui text-xs text-text-muted">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      {/* ─── Header 52px ─── */}
      <header className="flex items-center justify-between h-[52px]">
        <p className="font-ui text-xs text-text-muted">
          Assalamu&apos;alaikum, {name}
        </p>
        <span className="inline-flex items-center gap-1 bg-bg-surface border border-text-ghost/30 rounded-full px-2.5 py-1">
          <Flame size={14} className="text-gold-main" />
          <span className="font-ui text-xs font-semibold text-text-primary">
            {streak} hari
          </span>
        </span>
      </header>

      {/* ─── Rank + XP row ─── */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="rank">{rank.emoji} {rank.name}</Badge>
        <Badge variant="xp">+{todayXp} XP</Badge>
      </div>

      {/* ─── Countdown Card ─── */}
      <Card variant="elevated" className="mb-3">
        <div className="flex items-start justify-between">
          {/* Left column */}
          <div>
            <p className="font-ornament text-[9px] text-text-muted uppercase tracking-widest">
              SALAT BERIKUTNYA
            </p>
            <p className="font-display italic text-xl text-text-primary mt-1">
              {nextPrayer.name}
            </p>
          </div>
          {/* Right column */}
          <div className="text-right">
            <p className="font-display text-3xl text-green-glow leading-none">
              {prayerHasPassed ? '00:00:00' : formatCountdown(countdownMs)}
            </p>
            <p className="font-ui text-[9px] text-text-muted mt-1">
              {prayerHasPassed ? 'sudah masuk' : 'menit lagi'}
            </p>
          </div>
        </div>
        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] text-text-muted">
            Window tepat: {windowMinutes} mnt
          </p>
          {prayerHasPassed && (
            <Button variant="klaim" className="min-h-[36px] py-2">
              Klaim
            </Button>
          )}
        </div>
      </Card>

      {/* ─── Prayer Strip ─── */}
      <div className="flex gap-1 mb-3">
        {prayerSlots.map((slot) => {
          const state = getChipState(slot, now, nextPrayer, claimed);
          return (
            <div
              key={slot.key}
              className={cn(
                'flex-1 border rounded-xl py-2 text-center flex flex-col items-center',
                chipStyles[state],
              )}
            >
              <span className={cn('font-ornament text-[7px] uppercase', chipNameStyles[state])}>
                {slot.name}
              </span>
              <span className={cn('font-ui text-[9px] font-bold', chipNameStyles[state])}>
                {formatTime(slot.time)}
              </span>
              <span className={cn('w-1.5 h-1.5 rounded-full mt-0.5', chipDotStyles[state])} />
            </div>
          );
        })}
      </div>

      {/* ─── Divider ─── */}
      <div className="h-px bg-text-ghost/20 my-3" />

      {/* ─── Stats Row ─── */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
          <p className="font-display text-2xl text-green-glow">{todayXp}</p>
          <p className="font-ui text-[10px] text-text-muted mt-1">Amal Score</p>
        </div>
        <div className="flex-1 bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
          <p className="font-display text-2xl text-gold-light">{streak}</p>
          <p className="font-ui text-[10px] text-text-muted mt-1">Streak</p>
        </div>
        <div className="flex-1 bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
          <p className="font-display text-2xl text-[#6AB8A8]">{level}</p>
          <p className="font-ui text-[10px] text-text-muted mt-1">Level</p>
        </div>
      </div>

      {/* ─── Quest Preview ─── */}
      <Link href="/amal" className="block">
        <div className="flex justify-between items-center mb-2">
          <span className="font-ornament text-[9px] text-text-muted tracking-widest uppercase">
            QUEST HARI INI
          </span>
          <span className="text-green-light text-[11px] font-semibold">
            {questDone}/5 selesai
          </span>
        </div>
        {questItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2 py-2">
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                item.done ? 'bg-green-glow' : 'border border-text-ghost',
              )}
            />
            <span className="font-ui text-[11px] text-text-secondary flex-1">
              Salat {item.name}
            </span>
            <span
              className={cn(
                'font-bold text-[10px] text-right',
                item.done ? 'text-green-mid' : 'text-text-ghost',
              )}
            >
              +{item.xp} XP
            </span>
          </div>
        ))}
      </Link>
    </div>
  );
}
