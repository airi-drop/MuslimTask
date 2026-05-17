"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock3,
  CheckCircle2,
  Sunrise,
  Sunset,
  BookMarked,
  Heart,
  Moon,
  Users,
  Star,
  MoonStar,
} from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getPrayerTimes, formatTime, type PrayerSlot } from "@/lib/prayer";
import { loadLocation } from "@/lib/location";
import {
  loadProgress,
  saveProgress,
  claimPrayer,
  setAmalFlags,
  getTodayRecord,
  type Progress,
  type PrayerClaim,
} from "@/lib/progress";
import {
  calculatePrayerXP,
  getDzikirXP,
  getQuranXP,
  getTimingLabel,
  SUNNAH_XP,
} from "@/lib/xp";

// ─── Helpers ───

function isMondayOrThursday(): boolean {
  const day = new Date().getDay();
  return day === 1 || day === 4;
}

// Sunnah windows derived from prayer schedule
type SunnahWindow = {
  key: string;
  name: string;
  xp: number;
  inWindow: boolean;
  hint: string;
};

function computeSunnahWindows(
  slots: PrayerSlot[],
  now: Date,
): SunnahWindow[] {
  const get = (k: string) => slots.find((s) => s.key === k)?.time ?? null;
  const fajr = get("fajr");
  const sunrise = get("sunrise");
  const dhuhr = get("dhuhr");
  const isha = get("isha");

  const dhuhaStart = sunrise
    ? new Date(sunrise.getTime() + 45 * 60_000)
    : null;
  const dhuhaEnd = dhuhr ?? null;
  const tahajudStart = isha && fajr
    ? new Date(isha.getTime() + ((fajr.getTime() - isha.getTime()) * 2) / 3)
    : null;
  const tahajudEnd = fajr;
  const witirStart = isha;

  const inRange = (start: Date | null, end: Date | null): boolean =>
    !!start && !!end && now >= start && now <= end;
  const after = (t: Date | null): boolean => !!t && now >= t;

  return [
    {
      key: "dhuha",
      name: "Dhuha",
      xp: SUNNAH_XP.dhuha,
      inWindow: inRange(dhuhaStart, dhuhaEnd),
      hint: "Sesudah syuruq → sebelum dzuhur",
    },
    {
      key: "tahajud",
      name: "Tahajud",
      xp: SUNNAH_XP.tahajud,
      inWindow: inRange(tahajudStart, tahajudEnd),
      hint: "Sepertiga malam terakhir → sebelum subuh",
    },
    {
      key: "witir",
      name: "Witir",
      xp: SUNNAH_XP.witir,
      inWindow: after(witirStart),
      hint: "Setelah Isya → sebelum subuh",
    },
    {
      key: "rawatib",
      name: "Rawatib",
      xp: SUNNAH_XP.rawatib,
      inWindow: true, // Rawatib follows each fardhu, always claimable
      hint: "±15 menit sekitar setiap fardhu",
    },
  ];
}

// Max daily XP estimate for progress bar
const MAX_DAILY_XP = 800;

const SEDEKAH_TYPES = [
  { id: "uang", label: "Uang" },
  { id: "makanan", label: "Makanan" },
  { id: "tenaga", label: "Tenaga" },
] as const;

const PUASA_TYPES = [
  { id: "senin-kamis", label: "Senin-Kamis" },
  { id: "ayyamul-bidh", label: "Ayyamul Bidh" },
  { id: "dawud", label: "Dawud" },
  { id: "lainnya", label: "Lainnya" },
] as const;

// ─── Component ───

export default function AmalPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [prayerSlots, setPrayerSlots] = useState<PrayerSlot[]>([]);
  const [now, setNow] = useState(new Date());
  const [jamaahPrompt, setJamaahPrompt] = useState<string | null>(null);
  const [quranInput, setQuranInput] = useState("");
  const [showSedekahTypes, setShowSedekahTypes] = useState(false);
  const [showPuasaTypes, setShowPuasaTypes] = useState(false);

  // Load on mount
  useEffect(() => {
    const loc = loadLocation();
    setPrayerSlots(getPrayerTimes(loc));
    setProgress(loadProgress());
  }, []);

  // Tick every 30s
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const today = useMemo(
    () => (progress ? getTodayRecord(progress) : null),
    [progress],
  );
  const obligatoryPrayers = prayerSlots.filter((s) => s.obligatory);
  const sunnahWindows = useMemo(
    () => computeSunnahWindows(prayerSlots, now),
    [prayerSlots, now],
  );

  // Persist helper
  const persist = useCallback((next: Progress) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  function getPrayerState(slot: PrayerSlot): "not-yet" | "claimable" | "claimed" {
    if (!today) return "not-yet";
    if (today.prayers.includes(slot.key)) return "claimed";
    if (now.getTime() >= slot.time.getTime()) return "claimable";
    return "not-yet";
  }

  function handleClaimPrayer(key: string, isJamaah: boolean) {
    if (!progress) return;
    const slot = prayerSlots.find((s) => s.key === key);
    if (!slot) return;
    const claimTime = new Date();
    const xp = calculatePrayerXP(slot.time, claimTime, isJamaah);
    const diffMinutes = Math.floor(
      (claimTime.getTime() - slot.time.getTime()) / 60_000,
    );
    const claim: PrayerClaim = {
      key,
      claimTime: claimTime.toISOString(),
      prayerTime: slot.time.toISOString(),
      xp,
      isJamaah,
      diffMinutes,
    };
    persist(claimPrayer(progress, claim));
    setJamaahPrompt(null);
  }

  function handleClaimDzikir(type: "pagi" | "petang") {
    if (!progress) return;
    const fajr = prayerSlots.find((s) => s.key === "fajr")?.time;
    const sunrise = prayerSlots.find((s) => s.key === "sunrise")?.time;
    const asr = prayerSlots.find((s) => s.key === "asr")?.time;
    const maghrib = prayerSlots.find((s) => s.key === "maghrib")?.time;
    if (!fajr || !sunrise || !asr || !maghrib) return;
    const xp = getDzikirXP(type, { fajr, sunrise, asr, maghrib }, new Date());
    const patch =
      type === "pagi" ? { dzikirPagi: true } : { dzikirPetang: true };
    persist(setAmalFlags(progress, patch, xp));
  }

  function isDzikirInWindow(type: "pagi" | "petang"): boolean {
    const fajr = prayerSlots.find((s) => s.key === "fajr")?.time;
    const sunrise = prayerSlots.find((s) => s.key === "sunrise")?.time;
    const asr = prayerSlots.find((s) => s.key === "asr")?.time;
    const maghrib = prayerSlots.find((s) => s.key === "maghrib")?.time;
    if (!fajr || !sunrise || !asr || !maghrib) return false;
    if (type === "pagi") {
      return now >= fajr && now <= sunrise;
    }
    return now >= asr && now <= maghrib;
  }

  function handleQuranClaim(ayat: number) {
    if (!progress || ayat <= 0) return;
    const xp = getQuranXP(ayat);
    persist(
      setAmalFlags(progress, { quranAyat: ayat, quranXp: xp }, xp),
    );
    setQuranInput("");
  }

  function handleSedekah(type: (typeof SEDEKAH_TYPES)[number]["id"]) {
    if (!progress) return;
    if (today?.amal?.sedekah) return;
    persist(
      setAmalFlags(progress, { sedekah: true, sedekahType: type }, 10),
    );
    setShowSedekahTypes(false);
  }

  function handlePuasa(type: (typeof PUASA_TYPES)[number]["id"]) {
    if (!progress) return;
    if (today?.amal?.puasa) return;
    persist(
      setAmalFlags(progress, { puasa: true, puasaType: type }, 30),
    );
    setShowPuasaTypes(false);
  }

  function handleSunnah(key: string, xp: number, inWindow: boolean) {
    if (!progress) return;
    if (today?.amal?.sunnah?.[key]) return;
    if (!inWindow) return;
    persist(
      setAmalFlags(progress, { sunnah: { [key]: true } }, xp),
    );
  }

  if (!progress || !today) {
    return (
      <div className="px-5 py-6">
        <p className="font-ui text-xs text-text-muted">Memuat...</p>
      </div>
    );
  }

  const dailyXp = today.prayerXp + today.questXp;
  const xpPercent = Math.min(100, (dailyXp / MAX_DAILY_XP) * 100);
  const loc = typeof window !== "undefined" ? loadLocation() : null;

  return (
    <div className="px-5 pb-24">
      {/* Header + XP */}
      <div className="mb-5">
        <h1 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-1">
          AMAL HARIAN
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl italic text-green-glow">
            {dailyXp}
          </span>
          <span className="text-xs text-text-secondary">XP hari ini</span>
        </div>
        <ProgressBar value={xpPercent} color="green" height="md" className="mt-2" />
      </div>

      {/* Salat Fardhu */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          SALAT FARDHU
        </h2>
        <Card className="!p-0 overflow-hidden">
          {obligatoryPrayers.map((slot, idx) => {
            const state = getPrayerState(slot);
            const claim = today.prayerClaims?.[slot.key];
            return (
              <div key={slot.key}>
                {idx > 0 && <div className="h-px bg-text-ghost/20 ml-5" />}
                <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
                  <div className="w-5 flex-shrink-0">
                    {state === "claimed" ? (
                      <CheckCircle2 size={16} className="text-green-main" />
                    ) : (
                      <Clock3
                        size={16}
                        className={
                          state === "claimable"
                            ? "text-gold-main"
                            : "text-text-ghost"
                        }
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-display text-sm font-medium",
                        state === "claimed"
                          ? "text-text-muted"
                          : state === "claimable"
                            ? "text-text-primary font-semibold"
                            : "text-text-secondary",
                      )}
                    >
                      {slot.name}
                    </p>
                    <p className="text-xs text-text-muted font-sans">
                      {loc ? formatTime(slot.time, loc.timezone) : "--:--"}
                    </p>
                  </div>
                  {state === "claimed" && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-green-light">
                        +{claim?.xp ?? 10} XP
                      </span>
                      {claim?.isJamaah && (
                        <Users size={10} className="inline ml-1 text-green-mid" />
                      )}
                      {claim && (
                        <p className="text-[10px] text-text-muted">
                          {getTimingLabel(claim.diffMinutes)}
                        </p>
                      )}
                    </div>
                  )}
                  {state === "claimable" && (
                    <Button
                      variant="klaim"
                      className="!min-h-[36px] !min-w-[36px] py-1"
                      onClick={() => setJamaahPrompt(slot.key)}
                    >
                      KLAIM
                    </Button>
                  )}
                  {state === "not-yet" && (
                    <span className="text-[10px] text-text-ghost font-sans">
                      Belum waktunya
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      </section>

      {/* Salat Sunnah */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          SALAT SUNNAH
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {sunnahWindows.map((s) => {
            const claimed = !!today.amal?.sunnah?.[s.key];
            const Icon =
              s.key === "tahajud"
                ? MoonStar
                : s.key === "dhuha"
                  ? Sunrise
                  : Star;
            const disabled = !s.inWindow && !claimed;
            return (
              <button
                key={s.key}
                onClick={() => handleSunnah(s.key, s.xp, s.inWindow)}
                disabled={disabled || claimed}
                className={cn(
                  "rounded-xl border p-3 text-left transition active:scale-[0.97] min-h-[64px]",
                  claimed
                    ? "bg-green-main/10 border-green-dim/60"
                    : disabled
                      ? "bg-bg-surface border-text-ghost/30 opacity-40 cursor-not-allowed"
                      : "bg-bg-surface border-text-ghost/30",
                )}
                title={disabled ? "Di luar waktu" : s.hint}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    size={14}
                    className={
                      claimed
                        ? "text-green-main"
                        : s.inWindow
                          ? "text-gold-main"
                          : "text-text-ghost"
                    }
                  />
                  <span className="font-sans text-xs font-medium text-text-primary">
                    {s.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-bold text-[10px]",
                    claimed ? "text-green-light" : "text-gold-light",
                  )}
                >
                  {claimed ? `+${s.xp} XP ✓` : `+${s.xp} XP`}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dzikir */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          DZIKIR
        </h2>
        <Card className="!p-0 overflow-hidden">
          {/* Pagi */}
          <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
            <Sunrise
              size={16}
              className={
                isDzikirInWindow("pagi") ? "text-gold-main" : "text-text-ghost"
              }
            />
            <div className="flex-1">
              <p className="font-sans text-sm text-text-primary">Dzikir Pagi</p>
              <p className="text-[10px] text-text-muted">
                {isDzikirInWindow("pagi") ? "✓ Dalam waktu" : "Subuh → Syuruq"}
              </p>
            </div>
            {today.amal?.dzikirPagi ? (
              <span className="text-xs font-bold text-green-light">
                +XP ✓
              </span>
            ) : (
              <Button
                variant="klaim"
                className="!min-h-[36px] !min-w-[36px] py-1"
                onClick={() => handleClaimDzikir("pagi")}
              >
                KLAIM
              </Button>
            )}
          </div>
          <div className="h-px bg-text-ghost/20 ml-5" />
          {/* Petang */}
          <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
            <Sunset
              size={16}
              className={
                isDzikirInWindow("petang")
                  ? "text-gold-main"
                  : "text-text-ghost"
              }
            />
            <div className="flex-1">
              <p className="font-sans text-sm text-text-primary">Dzikir Petang</p>
              <p className="text-[10px] text-text-muted">
                {isDzikirInWindow("petang") ? "✓ Dalam waktu" : "Ashar → Maghrib"}
              </p>
            </div>
            {today.amal?.dzikirPetang ? (
              <span className="text-xs font-bold text-green-light">
                +XP ✓
              </span>
            ) : (
              <Button
                variant="klaim"
                className="!min-h-[36px] !min-w-[36px] py-1"
                onClick={() => handleClaimDzikir("petang")}
              >
                KLAIM
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Quran */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          AL-QURAN
        </h2>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <BookMarked size={14} className="text-text-secondary" />
            <span className="font-sans text-sm text-text-primary">
              Bacaan hari ini
            </span>
            {today.amal?.quranAyat ? (
              <span className="ml-auto text-xs font-bold text-green-light">
                +{today.amal.quranXp ?? 0} XP ✓
              </span>
            ) : null}
          </div>
          {today.amal?.quranAyat ? (
            <p className="text-xs text-text-secondary">
              {today.amal.quranAyat} ayat telah dicatat.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: "1–4 ayat", ayat: 4, xp: 10 },
                  { label: "5–10 ayat", ayat: 10, xp: 20 },
                  { label: "1 halaman", ayat: 20, xp: 35 },
                  { label: "1 juz", ayat: 30, xp: 100 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleQuranClaim(opt.ayat)}
                    className="rounded-lg border border-text-ghost/30 bg-bg-surface px-3 py-2 text-left transition active:scale-[0.97] min-h-[44px]"
                  >
                    <span className="block text-xs font-sans text-text-primary">
                      {opt.label}
                    </span>
                    <span className="block text-[10px] text-gold-light font-bold">
                      +{opt.xp} XP
                    </span>
                  </button>
                ))}
              </div>
              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={quranInput}
                  onChange={(e) => setQuranInput(e.target.value)}
                  placeholder="Jumlah ayat..."
                  className="flex-1 rounded-lg bg-bg-surface border border-text-ghost/30 px-3 py-2 text-sm font-sans text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-main min-h-[44px]"
                />
                <Button
                  variant="klaim"
                  className="!min-h-[44px]"
                  onClick={() => {
                    const n = parseInt(quranInput, 10);
                    if (!isNaN(n) && n > 0) handleQuranClaim(n);
                  }}
                  disabled={!quranInput || parseInt(quranInput, 10) <= 0}
                >
                  +{getQuranXP(parseInt(quranInput, 10) || 0)} XP
                </Button>
              </div>
            </>
          )}
        </Card>
      </section>

      {/* Sedekah */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          SEDEKAH
        </h2>
        <Card>
          <div className="flex items-center gap-3">
            <Heart
              size={16}
              className={
                today.amal?.sedekah ? "text-green-main" : "text-text-ghost"
              }
            />
            <span className="flex-1 font-sans text-sm text-text-primary">
              Sedekah hari ini?
            </span>
            {today.amal?.sedekah ? (
              <span className="text-xs font-bold text-green-light">
                +10 XP ✓
              </span>
            ) : (
              <Button
                variant="klaim"
                className="!min-h-[36px] py-1"
                onClick={() => setShowSedekahTypes((v) => !v)}
              >
                KLAIM
              </Button>
            )}
          </div>
          {showSedekahTypes && !today.amal?.sedekah && (
            <div className="mt-3 flex gap-2">
              {SEDEKAH_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSedekah(t.id)}
                  className="flex-1 rounded-lg border border-text-ghost/30 bg-bg-surface px-3 py-2 text-xs font-sans text-text-primary active:scale-[0.97] transition min-h-[44px]"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {today.amal?.sedekah && today.amal.sedekahType && (
            <p className="mt-2 text-[10px] text-text-muted">
              Tipe:{" "}
              {SEDEKAH_TYPES.find((t) => t.id === today.amal?.sedekahType)?.label}
            </p>
          )}
        </Card>
      </section>

      {/* Puasa Sunnah — only on Mon/Thu (PRD §5.6) */}
      {isMondayOrThursday() && (
        <section className="mb-6">
          <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
            PUASA SUNNAH
          </h2>
          <Card>
            <div className="flex items-center gap-3">
              <Moon
                size={16}
                className={
                  today.amal?.puasa ? "text-green-main" : "text-text-ghost"
                }
              />
              <span className="flex-1 font-sans text-sm text-text-primary">
                Puasa hari ini?
              </span>
              {today.amal?.puasa ? (
                <span className="text-xs font-bold text-green-light">
                  +30 XP ✓
                </span>
              ) : (
                <Button
                  variant="klaim"
                  className="!min-h-[36px] py-1"
                  onClick={() => setShowPuasaTypes((v) => !v)}
                >
                  KLAIM
                </Button>
              )}
            </div>
            {showPuasaTypes && !today.amal?.puasa && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {PUASA_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handlePuasa(t.id)}
                    className="rounded-lg border border-text-ghost/30 bg-bg-surface px-3 py-2 text-xs font-sans text-text-primary active:scale-[0.97] transition min-h-[44px]"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            {today.amal?.puasa && today.amal.puasaType && (
              <p className="mt-2 text-[10px] text-text-muted">
                Tipe:{" "}
                {PUASA_TYPES.find((t) => t.id === today.amal?.puasaType)?.label}
              </p>
            )}
          </Card>
        </section>
      )}

      {/* Jamaah Bottom Sheet (PRD §5.2) */}
      {jamaahPrompt && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 animate-fade-in"
            onClick={() => setJamaahPrompt(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-bg-mid border-t border-text-ghost/30 rounded-t-2xl p-5 pb-safe animate-slide-up max-w-[430px] mx-auto">
            <div className="w-10 h-1 bg-text-ghost/40 rounded-full mx-auto mb-4" />
            <p className="font-display italic text-lg text-text-primary text-center mb-4">
              Salat berjamaah?
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleClaimPrayer(jamaahPrompt, true)}
              >
                Ya · +20 XP
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => handleClaimPrayer(jamaahPrompt, false)}
              >
                Tidak
              </Button>
            </div>
            <button
              className="block mx-auto mt-3 text-xs text-text-muted underline"
              onClick={() => setJamaahPrompt(null)}
            >
              Batal
            </button>
          </div>
        </>
      )}
    </div>
  );
}
