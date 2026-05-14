/**
 * Offline shareable image generator using Canvas 2D API.
 * Produces a 1080x1350 PNG (4:5, optimal for IG feed/story).
 *
 * Pure browser / no external libs — fonts use system stack so rendering is
 * deterministic without bundling extra assets.
 */

export type ShareCardData = {
  username: string;
  streak: number;
  bestStreak: number;
  level: number;
  totalXp: number;
  todayXp: number;
  prayedCount: number;
  prayerTarget: number;
  /** Optional headline override, e.g. for achievement unlocks. */
  headline?: string;
  /** Optional sub-headline */
  subline?: string;
  /** Hijri formatted date, e.g. "Kamis, 26 Zulkaidah 1447 H" */
  hijri?: string;
  /** Gregorian formatted date */
  gregorian?: string;
};

const W = 1080;
const H = 1350;

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

function drawDotGrid(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(70, 242, 192, 0.07)";
  for (let y = 0; y < H; y += 36) {
    for (let x = 0; x < W; x += 36) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawIslamicStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = "rgba(245, 190, 61, 0.35)";
  ctx.lineWidth = 1.5;

  // 8-point star outer
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const radius = i % 2 === 0 ? r : r * 0.6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // inner star
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 + Math.PI / 16;
    const radius = i % 2 === 0 ? r * 0.7 : r * 0.42;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // circles
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawCrescent(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = "rgba(245, 190, 61, 0.85)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#04261A";
  ctx.beginPath();
  ctx.arc(cx + r * 0.35, cy - r * 0.1, r * 0.92, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fillTextSafe(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth?: number,
) {
  if (maxWidth) ctx.fillText(text, x, y, maxWidth);
  else ctx.fillText(text, x, y);
}

/**
 * Draws the share card on a canvas and returns a PNG blob.
 */
export async function renderShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak didukung di perangkat ini.");

  // ===== Background gradient (deep emerald → space navy) =====
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#085434");
  bg.addColorStop(0.6, "#04261A");
  bg.addColorStop(1, "#021810");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ===== Decorative glows =====
  const g1 = ctx.createRadialGradient(W * 0.85, H * 0.15, 50, W * 0.85, H * 0.15, 500);
  g1.addColorStop(0, "rgba(245, 190, 61, 0.35)");
  g1.addColorStop(1, "rgba(245, 190, 61, 0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.1, H * 0.85, 50, W * 0.1, H * 0.85, 600);
  g2.addColorStop(0, "rgba(31, 229, 165, 0.25)");
  g2.addColorStop(1, "rgba(31, 229, 165, 0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  drawDotGrid(ctx);
  drawIslamicStar(ctx, W * 0.86, H * 0.13, 130, Math.PI / 8);
  drawIslamicStar(ctx, W * 0.12, H * 0.88, 100, 0);

  // ===== Top brand row =====
  const padX = 80;
  ctx.fillStyle = "#46F2C0";
  ctx.font = "600 28px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText("MUSLIMTASK", padX, 80);

  ctx.fillStyle = "rgba(232, 244, 237, 0.55)";
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("QUEST IBADAH HARIAN", padX, 116);

  drawCrescent(ctx, W - padX - 30, 100, 28);

  // ===== Headline =====
  ctx.fillStyle = "#FBF9F2";
  ctx.font = "700 76px ui-sans-serif, system-ui, sans-serif";
  const headline = data.headline ?? `Streak ${data.streak} Hari!`;
  ctx.fillText(headline, padX, 220);

  ctx.fillStyle = "rgba(232, 244, 237, 0.75)";
  ctx.font = "400 30px ui-sans-serif, system-ui, sans-serif";
  const subline =
    data.subline ?? `Konsistensi @${data.username} hari ini`;
  fillTextSafe(ctx, subline, padX, 320, W - padX * 2);

  // ===== Big streak number =====
  // Card background
  ctx.save();
  roundRect(ctx, padX, 410, W - padX * 2, 320, 36);
  const cardGrad = ctx.createLinearGradient(padX, 410, W - padX, 730);
  cardGrad.addColorStop(0, "rgba(8, 84, 52, 0.7)");
  cardGrad.addColorStop(1, "rgba(2, 24, 16, 0.85)");
  ctx.fillStyle = cardGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // HUD corners
  drawHudCorners(ctx, padX, 410, W - padX * 2, 320);

  // Flame icon + streak
  ctx.fillStyle = "#F5BE3D";
  ctx.font = "600 28px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("🔥 STREAK", padX + 50, 450);

  // Glow
  ctx.shadowColor = "rgba(245, 190, 61, 0.6)";
  ctx.shadowBlur = 40;
  ctx.fillStyle = "#F5BE3D";
  ctx.font = "700 220px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(String(data.streak), padX + 50, 480);
  ctx.shadowBlur = 0;

  // "hari" suffix
  ctx.fillStyle = "rgba(232, 244, 237, 0.6)";
  ctx.font = "500 32px ui-sans-serif, system-ui, sans-serif";
  const streakWidth = ctx.measureText(String(data.streak)).width;
  ctx.font = "700 220px ui-sans-serif, system-ui, sans-serif";
  const realStreakWidth = ctx.measureText(String(data.streak)).width;
  ctx.font = "500 32px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("hari", padX + 50 + realStreakWidth + 20, 660);

  // Best streak (right side)
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(232, 244, 237, 0.55)";
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("TERBAIK", W - padX - 50, 460);

  ctx.fillStyle = "#FBF9F2";
  ctx.font = "700 64px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(`${data.bestStreak} hari`, W - padX - 50, 490);
  ctx.textAlign = "left";

  // ===== Stats row (Lv / XP / Salat) =====
  const statY = 800;
  const statH = 200;
  const statW = (W - padX * 2 - 40) / 3;

  drawStatBox(
    ctx,
    padX,
    statY,
    statW,
    statH,
    "LEVEL",
    String(data.level),
    `${data.totalXp} XP total`,
    "#46F2C0",
  );
  drawStatBox(
    ctx,
    padX + statW + 20,
    statY,
    statW,
    statH,
    "XP HARI INI",
    `+${data.todayXp}`,
    "Energi terkumpul",
    "#F5BE3D",
  );
  drawStatBox(
    ctx,
    padX + (statW + 20) * 2,
    statY,
    statW,
    statH,
    "SALAT",
    `${data.prayedCount}/${data.prayerTarget}`,
    "Target hari ini",
    "#46F2C0",
  );

  // ===== Bottom: date + footer =====
  if (data.gregorian) {
    ctx.fillStyle = "rgba(232, 244, 237, 0.7)";
    ctx.font = "500 26px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(data.gregorian, padX, 1080);
  }
  if (data.hijri) {
    ctx.fillStyle = "rgba(70, 242, 192, 0.85)";
    ctx.font = "500 24px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(data.hijri, padX, 1115);
  }

  // Quote / CTA
  ctx.fillStyle = "rgba(232, 244, 237, 0.55)";
  ctx.font = "italic 400 24px ui-serif, Georgia, serif";
  ctx.fillText(
    "“Sebaik-baik amal adalah yang dilakukan secara istiqamah.”",
    padX,
    1180,
  );
  ctx.font = "500 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("— HR. Bukhari & Muslim", padX, 1215);

  // Footer brand strip
  ctx.fillStyle = "rgba(70, 242, 192, 0.9)";
  ctx.font = "600 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("muslimtask.app", padX, 1265);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(232, 244, 237, 0.45)";
  ctx.font = "500 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Bergabung yuk!", W - padX, 1265);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Gagal membuat gambar."));
        else resolve(blob);
      },
      "image/png",
      0.95,
    );
  });
}

function drawHudCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.7)";
  ctx.lineWidth = 3;
  const len = 26;
  // top-left
  ctx.beginPath();
  ctx.moveTo(x + 4, y + len);
  ctx.lineTo(x + 4, y + 4);
  ctx.lineTo(x + len, y + 4);
  ctx.stroke();
  // bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - 4, y + h - len);
  ctx.lineTo(x + w - 4, y + h - 4);
  ctx.lineTo(x + w - len, y + h - 4);
  ctx.stroke();
  ctx.restore();
}

function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  sub: string,
  accent: string,
) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 24);
  ctx.fillStyle = "rgba(2, 24, 16, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(232, 244, 237, 0.55)";
  ctx.font = "600 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(label, x + 24, y + 24);

  ctx.fillStyle = accent;
  ctx.font = "700 80px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(value, x + 24, y + 60);

  ctx.fillStyle = "rgba(232, 244, 237, 0.5)";
  ctx.font = "400 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(sub, x + 24, y + h - 38);

  ctx.restore();
}

/**
 * Trigger download of a blob as a file.
 */
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
        title: "MuslimTask",
        text: text ?? "Progress ibadah harianku 💚",
      });
      return "shared";
    } catch {
      // user cancelled — silently fallback
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
