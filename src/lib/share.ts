/**
 * Premium shareable image generator (PRD §9.2 — Phase 9).
 * Produces a 1080x1080 (1:1) PNG using the Mihrab palette and font stack.
 *
 * Three card types share the same skeleton:
 *   - weekly      → progress recap (default)
 *   - achievement → badge unlock card
 *   - milestone   → streak / count milestone
 *
 * Public API is backward compatible with the prior 9:16 implementation:
 *   - ShareCardData (with new optional cardType / achievement / milestone)
 *   - renderShareCard(data): Promise<Blob>
 *   - downloadBlob(blob, filename)
 *   - shareOrDownload(blob, filename, text?)
 */

/* ─────────────────────────────────────────────────────────
 * Public types
 * ──────────────────────────────────────────────────────── */

export type ShareCardData = {
  username: string;
  streak: number;
  bestStreak: number;
  level: number;
  totalXp: number;
  todayXp: number;
  prayedCount: number;
  prayerTarget: number;
  hijri?: string;
  gregorian?: string;
  /** Override card type. Default = 'weekly'. */
  cardType?: "weekly" | "achievement" | "milestone";
  /** Required when cardType === 'achievement'. */
  achievement?: {
    name: string;
    description: string;
    tier: "common" | "mid" | "rare" | "legendary";
    emoji: string;
  };
  /** Required when cardType === 'milestone'. */
  milestone?: {
    /** e.g. "30 Hari Berturut", "100 Salat" */
    label: string;
    /** e.g. 30, 100 */
    value: number;
  };
};

/* ─────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────── */

const W = 1080;
const H = 1080;
const PAD = 96;

/** PRD palette */
const C = {
  bgDeepest: "#050E08",
  greenDim: "rgba(58, 138, 82, 0.25)",
  greenDivider: "rgba(58, 138, 82, 0.20)",
  greenAttribution: "rgba(58, 138, 82, 0.7)",
  greenMain: "#3A8A52",
  greenGlow: "#5DC47A",
  goldSubtle: "rgba(196, 136, 42, 0.1)",
  goldMain: "#C4882A",
  goldLight: "#D4A040",
  goldGlow: "#E8BC5A",
  textPrimary: "#E8F0EC",
  textSecondary: "#7A9A86",
  textMuted: "#3A5A44",
  textGhost: "#1E3028",
} as const;

/** Font family stacks — literal next/font/google family names with safe fallbacks. */
const FONT = {
  display: "'Cormorant Garamond', 'Cormorant', Georgia, serif",
  ornament: "'Cinzel', Georgia, serif",
  ui: "'DM Sans', system-ui, sans-serif",
} as const;

const QUOTE_TEXT =
  "\u201CSebaik-baik amal adalah yang paling konsisten, meskipun sedikit.\u201D";
const QUOTE_ATTR = "\u2014 HR. Bukhari & Muslim";

/* ─────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────── */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Wrap `text` into lines that fit within `maxWidth`. Returns the y-coordinate
 * after the last line (alphabetic baseline) so callers can stack content.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
  }
  return cursorY;
}

/** Small crescent + 5-point star ornament for the top-right corner. */
function drawCrescentOrnament(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
) {
  // Crescent: full disk minus an offset disk filled with bg color.
  ctx.save();
  ctx.fillStyle = C.goldLight;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.bgDeepest;
  ctx.beginPath();
  ctx.arc(cx + r * 0.32, cy - r * 0.1, r * 0.86, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5-point star to the upper right of the crescent.
  ctx.save();
  ctx.fillStyle = C.goldLight;
  const sx = cx + r * 1.55;
  const sy = cy - r * 0.45;
  const sr = r * 0.42;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? sr : sr * 0.45;
    const px = sx + Math.cos(angle) * radius;
    const py = sy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────
 * Rank inference (matches src/app/profil/page.tsx getRankInfo)
 * ──────────────────────────────────────────────────────── */

function getRankInfo(level: number): { title: string; emoji: string } {
  if (level >= 20) return { title: "Wali Ibadah", emoji: "\uD83D\uDC51" }; // 👑
  if (level >= 15) return { title: "Hafiz Istiqamah", emoji: "\uD83D\uDCAA" }; // 💪
  if (level >= 10) return { title: "Mujahid Ruhani", emoji: "\uD83D\uDD25" }; // 🔥
  if (level >= 5) return { title: "Murid Setia", emoji: "\u2B50" }; // ⭐
  return { title: "Musafir", emoji: "\uD83C\uDF31" }; // 🌱
}

/* ─────────────────────────────────────────────────────────
 * Tier helpers (kept inline to avoid a back-import on
 * achievementTier.ts — the tier labels here mirror that file)
 * ──────────────────────────────────────────────────────── */

type Tier = "common" | "mid" | "rare" | "legendary";

const TIER_COLOR: Record<Tier, string> = {
  common: C.textSecondary,
  mid: "#4AAA66",
  rare: C.goldLight,
  legendary: C.goldGlow,
};

const TIER_LABEL: Record<Tier, string> = {
  common: "Common",
  mid: "Menengah",
  rare: "Langka",
  legendary: "Legendaris",
};

/* ─────────────────────────────────────────────────────────
 * Skeleton — drawn first for all three card types
 * ──────────────────────────────────────────────────────── */

function drawSkeleton(ctx: CanvasRenderingContext2D) {
  // Solid background
  ctx.fillStyle = C.bgDeepest;
  ctx.fillRect(0, 0, W, H);

  // Outer green border
  ctx.strokeStyle = C.greenDim;
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, 984, 984);

  // Inner subtle gold border
  ctx.strokeStyle = C.goldSubtle;
  ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, 968, 968);

  // Top-left brand mark
  ctx.fillStyle = C.textMuted;
  ctx.font = `500 28px ${FONT.ornament}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("MIHRAB", PAD, 120);

  // Top-right crescent + star ornament
  drawCrescentOrnament(ctx, W - PAD - 24, 110, 28);

  // Footer
  ctx.fillStyle = C.textGhost;
  ctx.font = `400 22px ${FONT.ui}`;
  ctx.textAlign = "left";
  ctx.fillText("mihrab.app", PAD, 1000);
}

/* ─────────────────────────────────────────────────────────
 * Quote block — shared between weekly + milestone
 * ──────────────────────────────────────────────────────── */

function drawQuote(
  ctx: CanvasRenderingContext2D,
  startY: number,
  data: ShareCardData,
) {
  const maxWidth = W - PAD * 2;

  ctx.fillStyle = C.textSecondary;
  ctx.font = `italic 400 28px ${FONT.display}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  wrapText(ctx, QUOTE_TEXT, PAD, startY, maxWidth, 40);

  ctx.fillStyle = C.greenAttribution;
  ctx.font = `400 22px ${FONT.ui}`;
  ctx.fillText(QUOTE_ATTR, PAD, 900);

  // Optional date line(s) under the attribution.
  if (data.gregorian || data.hijri) {
    ctx.fillStyle = C.textSecondary;
    ctx.font = `400 22px ${FONT.ui}`;
    const parts = [data.gregorian, data.hijri].filter(Boolean) as string[];
    ctx.fillText(parts.join("  \u2022  "), PAD, 940);
  }
}

/* ─────────────────────────────────────────────────────────
 * Card variants
 * ──────────────────────────────────────────────────────── */

function drawWeeklyCard(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  const rank = getRankInfo(data.level);

  // Rank badge (just below MIHRAB brand)
  ctx.fillStyle = C.goldLight;
  ctx.font = `500 24px ${FONT.ornament}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${rank.emoji} ${rank.title.toUpperCase()}`, PAD, 165);

  // Username (display italic)
  ctx.fillStyle = C.textPrimary;
  ctx.font = `italic 500 52px ${FONT.display}`;
  ctx.fillText(data.username, PAD, 240);

  // Divider
  ctx.strokeStyle = C.greenDivider;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, 270);
  ctx.lineTo(W - PAD, 270);
  ctx.stroke();

  // Big number — derived "amal score" for the week
  const amalScore = Math.max(0, data.todayXp + 100 * data.level);
  ctx.fillStyle = C.greenGlow;
  ctx.font = `600 200px ${FONT.display}`;
  ctx.fillText(String(amalScore), PAD, 510);

  // Score label
  ctx.fillStyle = C.textMuted;
  ctx.font = `400 30px ${FONT.ui}`;
  ctx.fillText("Total XP minggu ini", PAD, 560);

  // Stat row — prayed count vs target
  ctx.fillStyle = C.goldLight;
  ctx.font = `500 36px ${FONT.ui}`;
  ctx.fillText(
    `${data.prayedCount}/${data.prayerTarget} salat`,
    PAD,
    640,
  );

  // Sub: streak info
  ctx.fillStyle = C.textMuted;
  ctx.font = `400 26px ${FONT.ui}`;
  ctx.fillText(
    `Streak: ${data.streak} hari \u00B7 Best: ${data.bestStreak}`,
    PAD,
    690,
  );

  // Quote block (with optional dates)
  drawQuote(ctx, 800, data);
}

function drawAchievementCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
) {
  const a = data.achievement;
  if (!a) {
    // Fallback to weekly if achievement payload is missing.
    drawWeeklyCard(ctx, data);
    return;
  }

  const cx = W / 2;

  // Large emoji center
  ctx.fillStyle = C.textPrimary;
  ctx.font = `400 200px ${FONT.ui}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(a.emoji, cx, 380);

  // Tier label
  ctx.fillStyle = TIER_COLOR[a.tier];
  ctx.font = `500 20px ${FONT.ornament}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(TIER_LABEL[a.tier].toUpperCase(), cx, 540);

  // Achievement name
  ctx.fillStyle = C.textPrimary;
  ctx.font = `italic 500 56px ${FONT.display}`;
  ctx.fillText(a.name, cx, 620);

  // Description (wrapped, centered)
  ctx.fillStyle = C.textSecondary;
  ctx.font = `400 24px ${FONT.ui}`;
  wrapText(ctx, a.description, cx, 680, W - PAD * 2, 34);

  // Username at bottom
  ctx.fillStyle = C.textMuted;
  ctx.font = `400 22px ${FONT.ui}`;
  ctx.fillText(`${data.username} unlocked this`, cx, 940);

  // Reset alignment for downstream draws
  ctx.textAlign = "left";
}

function drawMilestoneCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
) {
  const m = data.milestone ?? {
    label: `${data.streak} Hari Berturut`,
    value: data.streak,
  };

  const cx = W / 2;

  // Big milestone number
  ctx.fillStyle = C.goldGlow;
  ctx.font = `600 280px ${FONT.display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(m.value), cx, 460);

  // Milestone label (uppercase ornament)
  ctx.fillStyle = C.goldLight;
  ctx.font = `500 36px ${FONT.ornament}`;
  ctx.fillText(m.label.toUpperCase(), cx, 620);

  // Username
  ctx.fillStyle = C.textPrimary;
  ctx.font = `italic 500 36px ${FONT.display}`;
  ctx.fillText(data.username, cx, 720);

  // Quote — keep left-aligned at PAD for consistency with weekly
  ctx.textAlign = "left";
  drawQuote(ctx, 800, data);
}

/* ─────────────────────────────────────────────────────────
 * Public API
 * ──────────────────────────────────────────────────────── */

export async function renderShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported.");

  // Sensible defaults for canvas state
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  drawSkeleton(ctx);

  switch (data.cardType ?? "weekly") {
    case "achievement":
      drawAchievementCard(ctx, data);
      break;
    case "milestone":
      drawMilestoneCard(ctx, data);
      break;
    case "weekly":
    default:
      drawWeeklyCard(ctx, data);
      break;
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Failed to generate image."));
        else resolve(blob);
      },
      "image/png",
      0.92,
    );
  });
}

/** Trigger download of a blob as a file. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Try Web Share API (file share) first, fallback to download.
 * Returns 'shared' | 'downloaded'.
 */
export async function shareOrDownload(
  blob: Blob,
  filename: string,
  text?: string,
): Promise<"shared" | "downloaded"> {
  const file = new File([blob], filename, { type: "image/png" });
  if (
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    "canShare" in navigator &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "Mihrab",
        text: text ?? "My weekly Mihrab progress \u00B7 #Mihrab",
      });
      return "shared";
    } catch {
      // user cancelled — fall through to download
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
