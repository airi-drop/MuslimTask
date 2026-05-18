"use client";

import { useEffect, useState } from "react";
import { Trophy, X, Share2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { tierFromCategory, tierEmoji, type Tier } from "@/lib/achievementTier";
import type { ShareCardData } from "@/lib/share";

type Props = {
  /** Achievement IDs to celebrate. Pass [] to hide. */
  ids: string[];
  onDismiss: () => void;
  /** Username for share card generation */
  username?: string;
};

/**
 * Full-screen celebration overlay for newly-unlocked achievements.
 * PRD §8.5 — animated scale-in, auto-dismiss after 5s.
 */
export function AchievementUnlockToast({ ids, onDismiss, username = "Musafir" }: Props) {
  const [index, setIndex] = useState(0);
  const [sharing, setSharing] = useState(false);

  // Reset index when new ids come in
  useEffect(() => {
    setIndex(0);
  }, [ids]);

  // Auto-advance / dismiss after 5s
  useEffect(() => {
    if (ids.length === 0) return;
    const timer = setTimeout(() => {
      if (index < ids.length - 1) {
        setIndex((i) => i + 1);
      } else {
        onDismiss();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [ids, index, onDismiss]);

  if (ids.length === 0) return null;

  const id = ids[index];
  const def: Achievement | undefined = ACHIEVEMENTS.find((a) => a.id === id);
  if (!def) return null;

  const tier: Tier = tierFromCategory(def.category);
  const emoji = tierEmoji(tier);
  const defName = def.name;
  const defDesc = def.description;

  async function handleShare() {
    setSharing(true);
    try {
      const { renderShareCard, shareOrDownload } = await import("@/lib/share");
      const data: ShareCardData = {
        username,
        streak: 0,
        bestStreak: 0,
        level: 1,
        totalXp: 0,
        todayXp: 0,
        prayedCount: 0,
        prayerTarget: 5,
        cardType: "achievement",
        achievement: {
          name: defName,
          description: defDesc,
          tier,
          emoji,
        },
      };
      const blob = await renderShareCard(data);
      const date = new Date().toISOString().slice(0, 10);
      await shareOrDownload(blob, `mihrab-achievement-${date}.png`);
    } catch {
      // ignore share failures
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-5 bg-black/80 animate-fade-in">
      <Card
        variant="gold"
        className="w-full max-w-[320px] text-center animate-slide-up relative"
      >
        <button
          aria-label="Tutup"
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 text-text-muted hover:text-text-primary"
        >
          <X size={16} />
        </button>

        <Trophy
          size={48}
          className="mx-auto text-gold-glow animate-pulse-gold"
        />
        <p className="font-ornament text-[9px] uppercase tracking-widest text-gold-light mt-3">
          ACHIEVEMENT TERBUKA
        </p>
        <h3 className="font-display italic text-2xl text-text-primary mt-1">
          {def.name}
        </h3>
        <p className="text-xs text-text-secondary mt-2">{def.description}</p>
        <div className="mt-3 flex justify-center">
          <Badge variant={`tier-${tier}` as const}>
            {emoji} {tier.toUpperCase()}
          </Badge>
        </div>

        {ids.length > 1 && (
          <p className="mt-3 text-[10px] text-text-muted">
            {index + 1} / {ids.length}
          </p>
        )}

        <Button
          variant="primary"
          fullWidth
          className="mt-4"
          onClick={() => {
            if (index < ids.length - 1) setIndex((i) => i + 1);
            else onDismiss();
          }}
        >
          {index < ids.length - 1 ? "Selanjutnya" : "Tutup"}
        </Button>
        <button
          className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-gold-light min-h-[44px]"
          onClick={handleShare}
          disabled={sharing}
        >
          <Share2 size={14} />
          <span>{sharing ? "Memproses..." : "Bagikan Achievement Ini"}</span>
        </button>
      </Card>
    </div>
  );
}
