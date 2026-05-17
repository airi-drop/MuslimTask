"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock3,
  CheckCircle2,
  Sunrise,
  Sunset,
  BookMarked,
  Heart,
  Moon,
  Users,
} from "lucide-react";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { getPrayerTimes, formatTime, type PrayerSlot } from "@/lib/prayer";
import { loadLocation } from "@/lib/location";
import {
  loadProgress,
  saveProgress,
  markPrayer,
  addQuestXp,
  type PrayerKey,
} from "@/lib/progress";
import {
  calculatePrayerXP,
  getDzikirXP,
  getQuranXP,
  getTimingLabel,
} from "@/lib/xp";

// ─── Types ───

type PrayerClaim = {
  key: string;
  claimTime: string; // ISO
  prayerTime: string; // ISO
  xp: number;
  isJamaah: boolean;
  diffMinutes: number;
};

type DailyAmal = {
  date: string;
  prayers: PrayerClaim[];
  dzikirPagi: boolean;
  dzikirPetang: boolean;
  quranAyat: number;
  quranXp: number;
  sedekah: boolean;
  puasa: boolean;
};

// ─── Storage helpers ───

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function storageKey(): string {
  return `mihrab-amal-${todayKey()}`;
}

function loadAmal(): DailyAmal {
  if (typeof window === "undefined")
    return emptyAmal();
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return emptyAmal();
    return JSON.parse(raw) as DailyAmal;
  } catch {
    return emptyAmal();
  }
}

function saveAmal(data: DailyAmal): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(), JSON.stringify(data));
}

function emptyAmal(): DailyAmal {
  return {
    date: todayKey(),
    prayers: [],
    dzikirPagi: false,
    dzikirPetang: false,
    quranAyat: 0,
    quranXp: 0,
    sedekah: false,
    puasa: false,
  };
}

// ─── Helpers ───

function isMondayOrThursday(): boolean {
  const day = new Date().getDay();
  return day === 1 || day === 4;
}

function totalXpFromAmal(amal: DailyAmal): number {
  const prayerXp = amal.prayers.reduce((sum, p) => sum + p.xp, 0);
  const dzikirXp =
    (amal.dzikirPagi ? 15 : 0) + (amal.dzikirPetang ? 15 : 0);
  return prayerXp + dzikirXp + amal.quranXp + (amal.sedekah ? 10 : 0) + (amal.puasa ? 30 : 0);
}

// Max daily XP estimate: 5*120 + 30 + 100 + 10 + 30 = 770 (generous)
const MAX_DAILY_XP = 770;

// ─── Component ───

export default function AmalPage() {
  const [amal, setAmal] = useState<DailyAmal>(emptyAmal());
  const [prayerSlots, setPrayerSlots] = useState<PrayerSlot[]>([]);
  const [now, setNow] = useState(new Date());
  const [jamaahPrompt, setJamaahPrompt] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loc = loadLocation();
    const slots = getPrayerTimes(loc);
    setPrayerSlots(slots);
    setAmal(loadAmal());
  }, []);

  // Tick every 30s to update "now" for state checks
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Persist amal changes
  const updateAmal = useCallback((next: DailyAmal) => {
    setAmal(next);
    saveAmal(next);
  }, []);

  // ─── Prayer claim logic ───

  const obligatoryPrayers = prayerSlots.filter((s) => s.obligatory);

  function getPrayerState(
    slot: PrayerSlot,
  ): "not-yet" | "claimable" | "claimed" {
    const claimed = amal.prayers.find((p) => p.key === slot.key);
    if (claimed) return "claimed";
    if (now.getTime() >= slot.time.getTime()) return "claimable";
    return "not-yet";
  }

  function handleClaimPrayer(key: string, isJamaah: boolean) {
    const slot = prayerSlots.find((s) => s.key === key);
    if (!slot) return;

    const claimTime = new Date();
    const xp = calculatePrayerXP(slot.time, claimTime, isJamaah);
    const diffMs = claimTime.getTime() - slot.time.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    const claim: PrayerClaim = {
      key,
      claimTime: claimTime.toISOString(),
      prayerTime: slot.time.toISOString(),
      xp,
      isJamaah,
      diffMinutes,
    };

    const next = { ...amal, prayers: [...amal.prayers, claim] };
    updateAmal(next);

    // Also update the existing progress system
    let progress = loadProgress();
    progress = markPrayer(progress, key as PrayerKey);
    // Add the tiered XP difference (tiered XP - flat 10 already added by markPrayer)
    const extraXp = xp - 10;
    if (extraXp > 0) {
      progress = addQuestXp(progress, extraXp);
    }
    saveProgress(progress);

    setJamaahPrompt(null);
  }

  // ─── Dzikir logic ───

  function getDzikirSchedule() {
    const fajr = prayerSlots.find((s) => s.key === "fajr");
    const sunrise = prayerSlots.find((s) => s.key === "sunrise");
    const asr = prayerSlots.find((s) => s.key === "asr");
    const maghrib = prayerSlots.find((s) => s.key === "maghrib");
    if (!fajr || !sunrise || !asr || !maghrib) return null;
    return {
      fajr: fajr.time,
      sunrise: sunrise.time,
      asr: asr.time,
      maghrib: maghrib.time,
    };
  }

  function isDzikirInWindow(type: "pagi" | "petang"): boolean {
    const schedule = getDzikirSchedule();
    if (!schedule) return false;
    if (type === "pagi") {
      return (
        now.getTime() >= schedule.fajr.getTime() &&
        now.getTime() <= schedule.sunrise.getTime()
      );
    }
    return (
      now.getTime() >= schedule.asr.getTime() &&
      now.getTime() <= schedule.maghrib.getTime()
    );
  }

  function handleClaimDzikir(type: "pagi" | "petang") {
    const schedule = getDzikirSchedule();
    if (!schedule) return;
    const xp = getDzikirXP(type, schedule, new Date());
    const next = {
      ...amal,
      ...(type === "pagi" ? { dzikirPagi: true } : { dzikirPetang: true }),
    };
    updateAmal(next);

    let progress = loadProgress();
    progress = addQuestXp(progress, xp);
    saveProgress(progress);
  }

  // ─── Quran logic ───

  function handleQuranClaim(ayat: number) {
    const xp = getQuranXP(ayat);
    const next = { ...amal, quranAyat: ayat, quranXp: xp };
    updateAmal(next);

    let progress = loadProgress();
    progress = addQuestXp(progress, xp);
    saveProgress(progress);
  }

  // ─── Sedekah / Puasa ───

  function handleSedekah() {
    if (amal.sedekah) return;
    const next = { ...amal, sedekah: true };
    updateAmal(next);

    let progress = loadProgress();
    progress = addQuestXp(progress, 10);
    saveProgress(progress);
  }

  function handlePuasa() {
    if (amal.puasa) return;
    const next = { ...amal, puasa: true };
    updateAmal(next);

    let progress = loadProgress();
    progress = addQuestXp(progress, 30);
    saveProgress(progress);
  }

  // ─── Render ───

  const dailyXp = totalXpFromAmal(amal);
  const xpPercent = Math.min(100, (dailyXp / MAX_DAILY_XP) * 100);
  const loc = typeof window !== "undefined" ? loadLocation() : null;

  return (
    <div className="px-5 pb-24">
      {/* ─── Header + XP Progress ─── */}
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

      {/* ─── Salat Fardhu Section ─── */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          SALAT FARDHU
        </h2>
        <Card className="p-0 overflow-hidden">
          {obligatoryPrayers.map((slot, idx) => {
            const state = getPrayerState(slot);
            const claim = amal.prayers.find((p) => p.key === slot.key);

            return (
              <div key={slot.key}>
                {idx > 0 && (
                  <div className="h-px bg-text-ghost/20 ml-5" />
                )}
                <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
                  {/* Icon */}
                  <div className="w-5 flex-shrink-0">
                    {state === "claimed" ? (
                      <CheckCircle2
                        size={16}
                        className="text-green-main"
                      />
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

                  {/* Name + Time */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-display text-sm font-medium ${
                        state === "claimed"
                          ? "text-text-muted"
                          : state === "claimable"
                            ? "text-text-primary font-semibold"
                            : "text-text-secondary"
                      }`}
                    >
                      {slot.name}
                    </p>
                    <p className="text-xs text-text-muted font-sans">
                      {loc ? formatTime(slot.time, loc.timezone) : "--:--"}
                    </p>
                  </div>

                  {/* XP / Claim */}
                  {state === "claimed" && claim && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-green-light">
                        +{claim.xp} XP
                      </span>
                      {claim.isJamaah && (
                        <Users size={10} className="inline ml-1 text-green-mid" />
                      )}
                      <p className="text-[10px] text-text-muted">
                        {getTimingLabel(claim.diffMinutes)}
                      </p>
                    </div>
                  )}

                  {state === "claimable" && (
                    <Button
                      variant="klaim"
                      className="min-h-[36px] min-w-[36px] px-3 py-1"
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

      {/* ─── Jamaah Prompt Modal ─── */}
      {jamaahPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
          <Card className="w-full max-w-[320px] p-5 text-center">
            <p className="font-sans text-sm text-text-primary mb-4">
              Salat berjamaah?
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                className="min-h-[44px]"
                onClick={() => handleClaimPrayer(jamaahPrompt, true)}
              >
                Ya (+20 XP)
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="min-h-[44px]"
                onClick={() => handleClaimPrayer(jamaahPrompt, false)}
              >
                Tidak
              </Button>
            </div>
            <button
              className="mt-3 text-xs text-text-muted underline"
              onClick={() => setJamaahPrompt(null)}
            >
              Batal
            </button>
          </Card>
        </div>
      )}

      {/* ─── Dzikir Section ─── */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          DZIKIR
        </h2>
        <Card className="p-0 overflow-hidden">
          {/* Dzikir Pagi */}
          <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
            <Sunrise size={16} className={isDzikirInWindow("pagi") ? "text-gold-main" : "text-text-ghost"} />
            <div className="flex-1">
              <p className="font-sans text-sm text-text-primary">Dzikir Pagi</p>
              <p className="text-[10px] text-text-muted">
                {isDzikirInWindow("pagi") ? "✓ Dalam waktu" : "Subuh → Syuruq"}
              </p>
            </div>
            {amal.dzikirPagi ? (
              <span className="text-xs font-bold text-green-light">
                +{isDzikirInWindow("pagi") ? 15 : 5} XP ✓
              </span>
            ) : (
              <Button
                variant="klaim"
                className="min-h-[36px] min-w-[36px] px-3 py-1"
                onClick={() => handleClaimDzikir("pagi")}
              >
                KLAIM
              </Button>
            )}
          </div>

          <div className="h-px bg-text-ghost/20 ml-5" />

          {/* Dzikir Petang */}
          <div className="flex items-center min-h-[56px] px-4 py-2 gap-3">
            <Sunset size={16} className={isDzikirInWindow("petang") ? "text-gold-main" : "text-text-ghost"} />
            <div className="flex-1">
              <p className="font-sans text-sm text-text-primary">Dzikir Petang</p>
              <p className="text-[10px] text-text-muted">
                {isDzikirInWindow("petang") ? "✓ Dalam waktu" : "Ashar → Maghrib"}
              </p>
            </div>
            {amal.dzikirPetang ? (
              <span className="text-xs font-bold text-green-light">
                +{isDzikirInWindow("petang") ? 15 : 5} XP ✓
              </span>
            ) : (
              <Button
                variant="klaim"
                className="min-h-[36px] min-w-[36px] px-3 py-1"
                onClick={() => handleClaimDzikir("petang")}
              >
                KLAIM
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* ─── Quran Section ─── */}
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
            {amal.quranAyat > 0 && (
              <span className="ml-auto text-xs font-bold text-green-light">
                +{amal.quranXp} XP ✓
              </span>
            )}
          </div>
          {amal.quranAyat > 0 ? (
            <p className="text-xs text-text-secondary">
              {amal.quranAyat} ayat telah dicatat.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
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
          )}
        </Card>
      </section>

      {/* ─── Sedekah Section ─── */}
      <section className="mb-6">
        <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
          SEDEKAH
        </h2>
        <Card>
          <div className="flex items-center gap-3">
            <Heart
              size={16}
              className={amal.sedekah ? "text-green-main" : "text-text-ghost"}
            />
            <span className="flex-1 font-sans text-sm text-text-primary">
              Sedekah hari ini?
            </span>
            {amal.sedekah ? (
              <span className="text-xs font-bold text-green-light">+10 XP ✓</span>
            ) : (
              <Button
                variant="klaim"
                className="min-h-[36px] min-w-[36px] px-3 py-1"
                onClick={handleSedekah}
              >
                KLAIM
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* ─── Puasa Section (Mon/Thu only) ─── */}
      {isMondayOrThursday() && (
        <section className="mb-6">
          <h2 className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
            PUASA SUNNAH
          </h2>
          <Card>
            <div className="flex items-center gap-3">
              <Moon
                size={16}
                className={amal.puasa ? "text-green-main" : "text-text-ghost"}
              />
              <span className="flex-1 font-sans text-sm text-text-primary">
                Puasa Senin/Kamis?
              </span>
              {amal.puasa ? (
                <span className="text-xs font-bold text-green-light">+30 XP ✓</span>
              ) : (
                <Button
                  variant="klaim"
                  className="min-h-[36px] min-w-[36px] px-3 py-1"
                  onClick={handlePuasa}
                >
                  KLAIM
                </Button>
              )}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
