"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Trophy, Settings, Flame, Zap } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { ShareCardButton } from "@/components/ShareCardButton";

import { cn } from "@/lib/utils";
import { loadProgress, levelFromXp, type Progress } from "@/lib/progress";
import { loadSettings, displayName, type Settings as SettingsType } from "@/lib/settings";
import type { ShareCardData } from "@/lib/share";

/* ---------- Rank tiers ---------- */

function getRankInfo(level: number): { title: string; emoji: string } {
  if (level >= 20) return { title: "Wali Ibadah", emoji: "👑" };
  if (level >= 15) return { title: "Hafiz Istiqamah", emoji: "💪" };
  if (level >= 10) return { title: "Mujahid Ruhani", emoji: "🔥" };
  if (level >= 5) return { title: "Murid Setia", emoji: "⭐" };
  return { title: "Musafir", emoji: "🌱" };
}

/* ---------- Helpers ---------- */

function totalPrayers(p: Progress): number {
  return Object.values(p.history).reduce(
    (acc, rec) => acc + rec.prayers.length,
    0,
  );
}

/* ---------- Page ---------- */

export default function ProfilPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setSettings(loadSettings());
  }, []);

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
    <div className="px-5 py-6 pb-20 space-y-6">
      {/* ── Profile Header ── */}
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
            className="inline-flex items-center gap-1 text-xs text-green-light mt-0.5 min-h-[48px] py-2"
          >
            <Settings size={12} strokeWidth={1.5} />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* ── Rank Section ── */}
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

      {/* ── Stats Row ── */}
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

      {/* ── Quick Links ── */}
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
            <span>Lihat Achievement</span>
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
