"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { User, Trophy, Settings, Flame, Zap, Lock } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { ShareCardButton } from "@/components/ShareCardButton";
import { AchievementUnlockToast } from "@/components/AchievementUnlockToast";

import { cn } from "@/lib/utils";
import {
  loadProgress,
  saveProgress,
  levelFromXp,
  unlockAchievements,
  claimAchievements,
  type Progress,
} from "@/lib/progress";
import {
  loadSettings,
  displayName,
  type Settings as SettingsType,
} from "@/lib/settings";
import {
  evaluateAll,
  newlyUnlocked,
  type EvaluatedAchievement,
} from "@/lib/achievements";
import { loadQuests } from "@/lib/quests";
import { tierFromCategory, tierEmoji, type Tier } from "@/lib/achievementTier";
import type { ShareCardData } from "@/lib/share";

/* ─── Rank tiers ─── */

function getRankInfo(level: number): { title: string; emoji: string } {
  if (level >= 20) return { title: "Wali Ibadah", emoji: "👑" };
  if (level >= 15) return { title: "Hafiz Istiqamah", emoji: "💪" };
  if (level >= 10) return { title: "Mujahid Ruhani", emoji: "🔥" };
  if (level >= 5) return { title: "Murid Setia", emoji: "⭐" };
  return { title: "Musafir", emoji: "🌱" };
}

function totalPrayers(p: Progress): number {
  return Object.values(p.history).reduce(
    (acc, rec) => acc + rec.prayers.length,
    0,
  );
}

/* ─── Page ─── */

export default function ProfilPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [evaluated, setEvaluated] = useState<EvaluatedAchievement[]>([]);
  const [toastIds, setToastIds] = useState<string[]>([]);

  useEffect(() => {
    const p = loadProgress();
    const q = loadQuests();
    const s = loadSettings();

    // Detect newly unlocked achievements and persist
    const fresh = newlyUnlocked(p, q);
    if (fresh.length > 0) {
      const next = unlockAchievements(p, fresh);
      saveProgress(next);
      setProgress(next);
      setToastIds(fresh);
    } else {
      setProgress(p);
    }
    setSettings(s);
    setEvaluated(evaluateAll(p, q));
  }, []);

  function handleDismissToast() {
    if (!progress) {
      setToastIds([]);
      return;
    }
    // Mark as seen so the bell badge clears
    const next = claimAchievements(progress, toastIds);
    saveProgress(next);
    setProgress(next);
    setToastIds([]);
  }

  if (!progress || !settings) return null;

  const name = displayName(settings);
  const { level, intoLevel, toNext } = levelFromXp(progress.totalXp);
  const xpPercent = (intoLevel / (intoLevel + toNext)) * 100;
  const rank = getRankInfo(level);
  const prayers = totalPrayers(progress);

  const shareData = (): ShareCardData => ({
    username: name,
    streak: progress.streak,
    bestStreak: progress.bestStreak,
    level,
    totalXp: progress.totalXp,
    todayXp: progress.todayXp,
    prayedCount: prayers,
    prayerTarget: 5,
  });

  return (
    <div className="px-5 py-6 pb-24 space-y-6">
      <AchievementUnlockToast ids={toastIds} onDismiss={handleDismissToast} username={name} />

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-main to-green-glow">
          <span className="font-display text-xl text-text-primary">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl text-text-primary truncate">
            {name}
          </h1>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 text-xs text-green-light mt-0.5"
          >
            <Settings size={12} strokeWidth={1.5} />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Rank Card */}
      <section>
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-2">
          RANK
        </p>
        <Card variant="gold" className="flex flex-col items-center text-center gap-3">
          <Badge variant="rank">
            {rank.emoji} {rank.title}
          </Badge>
          <span className="font-display text-4xl text-green-glow">
            Lv. {level}
          </span>
          <div className="w-full space-y-1">
            <ProgressBar value={xpPercent} color="gold" height="sm" />
            <p className="text-[10px] font-sans text-text-secondary text-center">
              {intoLevel} / {intoLevel + toNext} XP ke level berikutnya
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-gold-light" />
            <span className="text-xs font-sans text-gold-light">
              Total {progress.totalXp} XP
            </span>
          </div>
        </Card>
      </section>

      {/* Stats Row */}
      <section>
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-2">
          STATISTIK
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
            <Flame size={14} className="mx-auto text-gold-light mb-1" />
            <span className="font-display text-2xl text-gold-light block">
              {progress.streak}
            </span>
            <span className="text-[9px] font-sans text-text-muted">Streak</span>
          </div>
          <div className="bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
            <User size={14} className="mx-auto text-green-glow mb-1" />
            <span className="font-display text-2xl text-green-glow block">
              {prayers}
            </span>
            <span className="text-[9px] font-sans text-text-muted">Total Salat</span>
          </div>
          <div className="bg-bg-surface border border-text-ghost/30 rounded-xl p-3 text-center">
            <Trophy size={14} className="mx-auto text-text-primary mb-1" />
            <span className="font-display text-2xl text-text-primary block">
              {progress.bestStreak}
            </span>
            <span className="text-[9px] font-sans text-text-muted">Best Streak</span>
          </div>
        </div>
      </section>

      {/* Achievement Grid (PRD §8.4) */}
      <AchievementGrid evaluated={evaluated} />

      {/* In-Progress Section */}
      <AchievementInProgress evaluated={evaluated} />

      {/* Quick Links */}
      <section>
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-2">
          MENU
        </p>
        <div className="space-y-2">
          <Link
            href="/achievement"
            className={cn(
              "flex items-center gap-3 bg-bg-surface border border-text-ghost/30 rounded-xl px-4 min-h-[48px]",
              "text-sm font-sans text-text-primary active:scale-[0.97] transition-transform duration-75",
            )}
          >
            <Trophy size={16} className="text-gold-main" />
            <span>Lihat Semua Achievement</span>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 bg-bg-surface border border-text-ghost/30 rounded-xl px-4 min-h-[48px]",
              "text-sm font-sans text-text-primary active:scale-[0.97] transition-transform duration-75",
            )}
          >
            <Settings size={16} className="text-green-light" />
            <span>Pengaturan</span>
          </Link>
          <div className="flex items-center">
            <ShareCardButton data={shareData} label="Bagikan Progress" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Achievement Grid ─── */

const TIER_ORDER: Record<Tier, number> = {
  legendary: 0,
  rare: 1,
  mid: 2,
  common: 3,
};

function AchievementGrid({ evaluated }: { evaluated: EvaluatedAchievement[] }) {
  // Sort: unlocked first, then by tier rarity
  const sorted = useMemo(
    () =>
      [...evaluated].sort((a, b) => {
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        const tierA = tierFromCategory(a.def.category);
        const tierB = tierFromCategory(b.def.category);
        return TIER_ORDER[tierA] - TIER_ORDER[tierB];
      }),
    [evaluated],
  );

  const visible = sorted.slice(0, 9); // First 9 in grid; rest via /achievement link
  const unlockedCount = evaluated.filter((e) => e.unlocked).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted">
          ACHIEVEMENT
        </p>
        <span className="text-[10px] font-sans text-text-secondary">
          {unlockedCount} / {evaluated.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {visible.map((e) => {
          const tier = tierFromCategory(e.def.category);
          const emoji = tierEmoji(tier);
          const tierBg: Record<Tier, string> = {
            common: "bg-bg-surface border-text-ghost/30",
            mid: "bg-green-main/10 border-green-dim/40",
            rare: "bg-gold-main/10 border-gold-main/30",
            legendary:
              "bg-gradient-to-br from-green-mid/15 to-gold-dim/15 border-green-light/30",
          };
          const tierText: Record<Tier, string> = {
            common: "text-text-muted",
            mid: "text-green-light",
            rare: "text-gold-light",
            legendary: "text-green-glow",
          };
          return (
            <div
              key={e.def.id}
              className={cn(
                "rounded-xl border p-3 text-center min-h-[96px] flex flex-col items-center justify-center gap-1 relative overflow-hidden",
                tierBg[tier],
                !e.unlocked && "opacity-40",
              )}
            >
              {!e.unlocked && (
                <div className="absolute inset-0 bg-bg-deepest/40 flex items-center justify-center pointer-events-none">
                  <Lock size={14} className="text-text-muted" />
                </div>
              )}
              <span className="text-2xl leading-none">{emoji}</span>
              <p
                className={cn(
                  "font-ornament text-[8px] uppercase tracking-wide leading-tight line-clamp-2",
                  tierText[tier],
                )}
              >
                {e.def.name}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── In-Progress Section ─── */

function AchievementInProgress({
  evaluated,
}: {
  evaluated: EvaluatedAchievement[];
}) {
  const inProgress = evaluated
    .filter((e) => !e.unlocked && e.current > 0 && e.target > 0)
    .sort((a, b) => b.current / b.target - a.current / a.target)
    .slice(0, 3);

  if (inProgress.length === 0) return null;

  return (
    <section>
      <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-2">
        SEDANG DIKEJAR
      </p>
      <div className="space-y-2">
        {inProgress.map((e) => {
          const pct = Math.min(100, (e.current / e.target) * 100);
          return (
            <div
              key={e.def.id}
              className="bg-bg-surface border border-text-ghost/30 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-sans text-xs text-text-primary">
                  {e.def.name}
                </span>
                <span className="font-ui text-[10px] text-text-muted">
                  {e.current} / {e.target}
                </span>
              </div>
              <ProgressBar value={pct} color="gold" height="xs" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
