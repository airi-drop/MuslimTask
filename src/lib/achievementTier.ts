import type { AchievementCategory } from "./achievements";

/**
 * PRD §8.3 tier system. The existing achievements module organizes by
 * `category`; we map those to PRD-spec tiers for visual grouping.
 */
export type Tier = "common" | "mid" | "rare" | "legendary";

const CATEGORY_TIER: Record<AchievementCategory, Tier> = {
  salat: "common",
  streak: "mid",
  quran: "rare",
  mihrab: "mid",
  xp: "legendary",
};

export function tierFromCategory(c: AchievementCategory): Tier {
  return CATEGORY_TIER[c];
}

export function tierEmoji(t: Tier): string {
  switch (t) {
    case "common":
      return "🌱";
    case "mid":
      return "⭐";
    case "rare":
      return "🥇";
    case "legendary":
      return "💎";
  }
}

export function tierLabel(t: Tier): string {
  switch (t) {
    case "common":
      return "Common";
    case "mid":
      return "Menengah";
    case "rare":
      return "Langka";
    case "legendary":
      return "Legendaris";
  }
}
