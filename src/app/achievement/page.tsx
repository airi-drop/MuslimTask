"use client";

import { useEffect, useState, useMemo } from "react";
import { Lock, Trophy } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { AchievementUnlockToast } from "@/components/AchievementUnlockToast";
import { cn } from "@/lib/utils";
import {
  loadProgress,
  saveProgress,
  unlockAchievements,
  claimAchievements,
  type Progress,
} from "@/lib/progress";
import {
  evaluateAll,
  newlyUnlocked,
  type EvaluatedAchievement,
} from "@/lib/achievements";
import { loadQuests } from "@/lib/quests";
import { tierFromCategory, tierEmoji, tierLabel, type Tier } from "@/lib/achievementTier";

const TIER_ORDER: Record<Tier, number> = {
  legendary: 0,
  rare: 1,
  mid: 2,
  common: 3,
};

export default function AchievementPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [evaluated, setEvaluated] = useState<EvaluatedAchievement[]>([]);
  const [toastIds, setToastIds] = useState<string[]>([]);

  useEffect(() => {
    const p = loadProgress();
    const q = loadQuests();
    const fresh = newlyUnlocked(p, q);
    if (fresh.length > 0) {
      const next = unlockAchievements(p, fresh);
      saveProgress(next);
      setProgress(next);
      setToastIds(fresh);
    } else {
      setProgress(p);
    }
    setEvaluated(evaluateAll(p, q));
  }, []);

  function handleDismissToast() {
    if (!progress) {
      setToastIds([]);
      return;
    }
    const next = claimAchievements(progress, toastIds);
    saveProgress(next);
    setProgress(next);
    setToastIds([]);
  }

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

  const unlockedCount = evaluated.filter((e) => e.unlocked).length;
  const inProgress = evaluated
    .filter((e) => !e.unlocked && e.current > 0 && e.target > 0)
    .sort((a, b) => b.current / b.target - a.current / a.target);

  if (!progress) return null;

  return (
    <div className="px-5 py-6 pb-24 space-y-6">
      <AchievementUnlockToast ids={toastIds} onDismiss={handleDismissToast} />

      {/* Header */}
      <div>
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted">
          ACHIEVEMENT
        </p>
        <div className="flex items-center justify-between mt-1">
          <h1 className="font-display text-xl text-text-primary">
            Koleksi Badge
          </h1>
          <span className="text-xs font-sans text-text-secondary">
            {unlockedCount} / {evaluated.length} terbuka
          </span>
        </div>
      </div>

      {/* Full Grid — 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        {sorted.map((e) => {
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
                "rounded-xl border p-3 text-center min-h-[110px] flex flex-col items-center justify-center gap-1 relative overflow-hidden",
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
                  "font-ornament text-[7px] uppercase tracking-wide leading-tight line-clamp-2 mt-1",
                  tierText[tier],
                )}
              >
                {e.def.name}
              </p>
              <p className="text-[8px] text-text-muted line-clamp-2 mt-0.5">
                {e.def.description}
              </p>
              {e.unlocked && (
                <Badge variant={`tier-${tier}` as "tier-common" | "tier-mid" | "tier-rare" | "tier-legendary"} className="mt-1 !text-[7px] !px-2 !py-0.5">
                  {tierLabel(tier)}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* In-Progress Section */}
      {inProgress.length > 0 && (
        <section>
          <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-2">
            SEDANG DIKEJAR
          </p>
          <div className="space-y-2">
            {inProgress.map((e) => {
              const pct = Math.min(100, (e.current / e.target) * 100);
              return (
                <Card key={e.def.id} className="!p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans text-xs text-text-primary">
                      {e.def.name}
                    </span>
                    <span className="font-ui text-[10px] text-text-muted">
                      {e.current} / {e.target}
                    </span>
                  </div>
                  <ProgressBar value={pct} color="gold" height="xs" />
                  <p className="text-[10px] text-text-muted mt-1">
                    {e.def.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
