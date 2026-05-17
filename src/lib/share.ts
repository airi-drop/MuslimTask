/**
 * Premium shareable image generator using Canvas 2D API.
 * Produces a 1080x1920 PNG (9:16, optimal for IG/WA story).
 *
 * Pure browser / no external libs — fonts use system stack.
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
  headline?: string;
  subline?: string;
  hijri?: string;
  gregorian?: string;
};

const W = 1080;
const H = 1920;

/** Rank title based on level */
function getRank(level: number): { title: string; titleEn: string } {
  if (level >= 20) return { title: "Wali Ibadah", titleEn: "Worship Guardian" };
  if (level >= 15) return { title: "Hafiz Istiqamah", titleEn: "Steadfast Hafiz" };
  if (level >= 10) return { title: "Mujahid Ruhani", titleEn: "Spiritual Warrior" };
  if (level >= 7) return { title: "Salik Mujtahid", titleEn: "Devoted Traveler" };
  if (level >= 4) return { title: "Murid Setia", titleEn: "Faithful Student" };
  if (level >= 2) return { title: "Pencari Cahaya", titleEn: "Light Seeker" };
  return { title: "Musafir", titleEn: "Traveler" };
}

/** Streak badge */
function getStreakBadge(streak: number): string {
  if (streak >= 100) return "🏆 LEGENDARY";
  if (streak >= 30) return "⭐ MASTER";
  if (streak >= 14) return "🔥 ON FIRE";
  if (streak >= 7) return "💪 STRONG";
  if (streak >= 3) return "✨ RISING";
  return "🌱 STARTING";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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
  ctx.fillStyle = "rgba(70, 242, 192, 0.05)";
  for (let y = 0; y < H; y += 40) {
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawIslamicPattern(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rotation = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = "rgba(245, 190, 61, 0.2)";
  ctx.lineWidth = 1.5;

  // 8-point star
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const radius = i % 2 === 0 ? r : r * 0.55;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawProgressRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, pct: number, color: string) {
  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(70, 242, 192, 0.15)";
  ctx.lineWidth = 12;
  ctx.stroke();

  // Progress arc
  if (pct > 0) {
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * Math.min(pct, 100)) / 100;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
  }
}

function drawCrescent(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = "rgba(245, 190, 61, 0.9)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#04261A";
  ctx.beginPath();
  ctx.arc(cx + r * 0.35, cy - r * 0.1, r * 0.88, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHudCorners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.6)";
  ctx.lineWidth = 3;
  const len = 30;
  ctx.beginPath(); ctx.moveTo(x + 4, y + len); ctx.lineTo(x + 4, y + 4); ctx.lineTo(x + len, y + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w - 4, y + 4); ctx.lineTo(x + w - 4, y + len); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w - len, y + 4); ctx.lineTo(x + w - 4, y + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 4, y + h - len); ctx.lineTo(x + 4, y + h - 4); ctx.lineTo(x + len, y + h - 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w - 4, y + h - len); ctx.lineTo(x + w - 4, y + h - 4); ctx.lineTo(x + w - len, y + h - 4); ctx.stroke();
  ctx.restore();
}

export async function renderShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported.");

  const padX = 80;
  const rank = getRank(data.level);
  const badge = getStreakBadge(data.streak);
  const prayerPct = Math.round((data.prayedCount / data.prayerTarget) * 100);

  // ===== Background =====
  const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
  bg.addColorStop(0, "#0A3D2A");
  bg.addColorStop(0.4, "#04261A");
  bg.addColorStop(1, "#020E0A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Glows
  const g1 = ctx.createRadialGradient(W * 0.8, H * 0.12, 50, W * 0.8, H * 0.12, 450);
  g1.addColorStop(0, "rgba(245, 190, 61, 0.3)");
  g1.addColorStop(1, "rgba(245, 190, 61, 0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.15, H * 0.7, 50, W * 0.15, H * 0.7, 500);
  g2.addColorStop(0, "rgba(70, 242, 192, 0.2)");
  g2.addColorStop(1, "rgba(70, 242, 192, 0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  drawDotGrid(ctx);
  drawIslamicPattern(ctx, W * 0.85, H * 0.08, 160, Math.PI / 12);
  drawIslamicPattern(ctx, W * 0.15, H * 0.92, 120, 0);

  // ===== Top brand =====
  ctx.fillStyle = "#46F2C0";
  ctx.font = "700 32px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText("MIHRAB", padX, 80);

  ctx.fillStyle = "rgba(232, 244, 237, 0.5)";
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("QUEST IBADAH HARIAN", padX, 120);

  drawCrescent(ctx, W - padX - 35, 100, 30);

  // ===== Username + Rank =====
  ctx.fillStyle = "rgba(232, 244, 237, 0.7)";
  ctx.font = "500 28px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(`@${data.username}`, padX, 200);

  ctx.fillStyle = "#F5BE3D";
  ctx.font = "700 36px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(rank.title, padX, 240);

  // ===== Main streak card =====
  const cardY = 320;
  const cardH = 480;
  roundRect(ctx, padX, cardY, W - padX * 2, cardH, 40);
  const cardGrad = ctx.createLinearGradient(padX, cardY, W - padX, cardY + cardH);
  cardGrad.addColorStop(0, "rgba(10, 61, 42, 0.8)");
  cardGrad.addColorStop(1, "rgba(2, 14, 10, 0.9)");
  ctx.fillStyle = cardGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();
  drawHudCorners(ctx, padX, cardY, W - padX * 2, cardH);

  // Badge
  ctx.fillStyle = "rgba(245, 190, 61, 0.15)";
  roundRect(ctx, padX + 40, cardY + 35, 200, 40, 20);
  ctx.fill();
  ctx.fillStyle = "#F5BE3D";
  ctx.font = "700 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(badge, padX + 55, cardY + 43);

  // Big streak number
  ctx.shadowColor = "rgba(245, 190, 61, 0.5)";
  ctx.shadowBlur = 60;
  ctx.fillStyle = "#F5BE3D";
  ctx.font = "800 260px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(String(data.streak), padX + 40, cardY + 80);
  ctx.shadowBlur = 0;

  // "days streak" label
  const streakNumW = ctx.measureText(String(data.streak)).width;
  ctx.fillStyle = "rgba(232, 244, 237, 0.6)";
  ctx.font = "500 40px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("DAYS", padX + 40 + streakNumW + 20, cardY + 280);
  ctx.fillText("STREAK", padX + 40 + streakNumW + 20, cardY + 325);

  // Best streak (bottom right of card)
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(232, 244, 237, 0.5)";
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("PERSONAL BEST", W - padX - 50, cardY + cardH - 90);
  ctx.fillStyle = "#FBF9F2";
  ctx.font = "700 56px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(`${data.bestStreak} days`, W - padX - 50, cardY + cardH - 55);
  ctx.textAlign = "left";

  // ===== Stats row =====
  const statsY = cardY + cardH + 50;
  const statW = (W - padX * 2 - 40) / 3;
  const statH = 180;

  drawStatBox(ctx, padX, statsY, statW, statH, "LEVEL", String(data.level), `${data.totalXp} XP`, "#46F2C0");
  drawStatBox(ctx, padX + statW + 20, statsY, statW, statH, "TODAY", `+${data.todayXp}`, "XP earned", "#F5BE3D");

  // Prayer completion ring
  const ringX = padX + (statW + 20) * 2;
  roundRect(ctx, ringX, statsY, statW, statH, 24);
  ctx.fillStyle = "rgba(2, 24, 16, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(70, 242, 192, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(232, 244, 237, 0.55)";
  ctx.font = "600 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("PRAYERS", ringX + 24, statsY + 24);

  const ringCx = ringX + statW / 2;
  const ringCy = statsY + statH / 2 + 15;
  drawProgressRing(ctx, ringCx, ringCy, 45, prayerPct, prayerPct >= 100 ? "#F5BE3D" : "#46F2C0");

  ctx.fillStyle = prayerPct >= 100 ? "#F5BE3D" : "#FBF9F2";
  ctx.font = "700 36px ui-sans-serif, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${data.prayedCount}/${data.prayerTarget}`, ringCx, ringCy + 12);
  ctx.textAlign = "left";

  // ===== Motivational quote =====
  const quoteY = statsY + statH + 70;
  ctx.fillStyle = "rgba(232, 244, 237, 0.5)";
  ctx.font = "italic 400 28px ui-serif, Georgia, serif";
  ctx.fillText("\u201CSebaik-baik amal adalah yang paling", padX, quoteY);
  ctx.fillText("konsisten, meskipun sedikit.\u201D", padX, quoteY + 38);
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillStyle = "rgba(70, 242, 192, 0.7)";
  ctx.fillText("— HR. Bukhari & Muslim", padX, quoteY + 90);

  // ===== Date =====
  const dateY = quoteY + 150;
  if (data.gregorian) {
    ctx.fillStyle = "rgba(232, 244, 237, 0.65)";
    ctx.font = "500 26px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(data.gregorian, padX, dateY);
  }
  if (data.hijri) {
    ctx.fillStyle = "rgba(70, 242, 192, 0.8)";
    ctx.font = "500 24px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(data.hijri, padX, dateY + 36);
  }

  // ===== Footer CTA =====
  const footY = H - 100;
  ctx.fillStyle = "rgba(70, 242, 192, 0.9)";
  ctx.font = "700 26px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("mihrab.app", padX, footY);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(232, 244, 237, 0.5)";
  ctx.font = "500 22px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("Join the journey ✨", W - padX, footY);
  ctx.textAlign = "left";

  // Separator line
  ctx.strokeStyle = "rgba(70, 242, 192, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, footY - 30);
  ctx.lineTo(W - padX, footY - 30);
  ctx.stroke();

  return new Promise((resolve, reject) => {
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

function drawStatBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, value: string, sub: string, accent: string) {
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
  ctx.font = "700 72px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(value, x + 24, y + 55);

  ctx.fillStyle = "rgba(232, 244, 237, 0.45)";
  ctx.font = "400 20px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText(sub, x + 24, y + h - 30);
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
        title: "Mihrab",
        text: text ?? "My daily worship progress 💚 #Mihrab",
      });
      return "shared";
    } catch {
      // user cancelled
    }
  }
  downloadBlob(blob, filename);
  return "downloaded";
}
