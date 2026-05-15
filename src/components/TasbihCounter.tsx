"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { loadSettings } from "@/lib/settings";

type Preset = {
  id: string;
  label: string;
  arabic: string;
  target: number;
};

const PRESETS: Preset[] = [
  { id: "subhanallah", label: "Subhanallah", arabic: "سُبْحَانَ اللَّهِ", target: 33 },
  { id: "alhamdulillah", label: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", target: 33 },
  { id: "allahuakbar", label: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", target: 33 },
  { id: "lailahaillallah", label: "La ilaha illallah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", target: 100 },
  { id: "astaghfirullah", label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
];

const STORAGE_KEY = "mt:tasbih";

type TasbihData = {
  lifetime: Record<string, number>;
};

function loadTasbih(): TasbihData {
  if (typeof window === "undefined") return { lifetime: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lifetime: {} };
    return JSON.parse(raw) as TasbihData;
  } catch {
    return { lifetime: {} };
  }
}

function saveTasbih(data: TasbihData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function vibrate(ms: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (!loadSettings().vibrate) return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* ignore */
  }
}

export function TasbihCounter() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [count, setCount] = useState(0);
  const [tasbihData, setTasbihData] = useState<TasbihData>({ lifetime: {} });
  const [customTarget, setCustomTarget] = useState(33);
  const [isCustom, setIsCustom] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasbihData(loadTasbih());
    setHydrated(true);
  }, []);

  const target = isCustom ? customTarget : activePreset.target;
  const done = count >= target;
  const pct = Math.min(100, (count / target) * 100);

  const tap = useCallback(() => {
    if (done) return;
    const next = count + 1;
    setCount(next);

    const presetId = isCustom ? "custom" : activePreset.id;
    const updated: TasbihData = {
      ...tasbihData,
      lifetime: {
        ...tasbihData.lifetime,
        [presetId]: (tasbihData.lifetime[presetId] || 0) + 1,
      },
    };
    setTasbihData(updated);
    saveTasbih(updated);

    if (next >= target) {
      vibrate([20, 40, 20]);
    } else {
      vibrate(8);
    }
  }, [count, done, target, isCustom, activePreset.id, tasbihData]);

  function reset() {
    setCount(0);
  }

  function selectPreset(preset: Preset) {
    setActivePreset(preset);
    setIsCustom(false);
    setCount(0);
  }

  function selectCustom() {
    setIsCustom(true);
    setCount(0);
  }

  const lifetimeKey = isCustom ? "custom" : activePreset.id;
  const lifetimeTotal = tasbihData.lifetime[lifetimeKey] || 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Tasbih"
        title="Tasbih Digital"
        description="Dzikir dengan counter digital. Pilih preset atau atur target sendiri. Data tersimpan otomatis."
        back={{ href: "/", label: "Dashboard" }}
      />

      {/* Preset chips */}
      <section className="card p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPreset(p)}
              className={`pill text-xs transition ${
                !isCustom && activePreset.id === p.id
                  ? "bg-emerald-700 text-parchment-50 shadow-glow"
                  : "border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
              }`}
            >
              {p.label} ({p.target}x)
            </button>
          ))}
          <button
            onClick={selectCustom}
            className={`pill text-xs transition ${
              isCustom
                ? "bg-emerald-700 text-parchment-50 shadow-glow"
                : "border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
            }`}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <div className="mt-3 flex items-center gap-3">
            <label className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
              Target:
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={customTarget}
              onChange={(e) => {
                const v = Math.max(1, Math.min(9999, Number(e.target.value) || 1));
                setCustomTarget(v);
                setCount(0);
              }}
              className="w-24 rounded-xl border border-emerald-100 bg-white px-3 py-1.5 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
            />
          </div>
        )}
      </section>

      {/* Big tappable circle */}
      <section className="card flex flex-col items-center p-6 sm:p-8">
        {!isCustom && (
          <p className="arabic mb-4 text-2xl text-emerald-700 dark:text-parchment-50 sm:text-3xl" dir="rtl">
            {activePreset.arabic}
          </p>
        )}

        <button
          onClick={tap}
          disabled={!hydrated || done}
          className={`group relative grid h-48 w-48 place-items-center rounded-full border-4 transition sm:h-56 sm:w-56 ${
            done
              ? "border-neon-400 bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-glow cursor-default"
              : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300 active:scale-95 dark:border-emerald-800 dark:from-space-900 dark:to-space-800 dark:hover:border-neon-500/60"
          }`}
          aria-label={done ? "Selesai" : "Tap untuk menghitung"}
        >
          <div className="text-center">
            <div
              className={`font-display text-5xl font-bold leading-none sm:text-6xl ${
                done
                  ? "text-glow-neon"
                  : "text-emerald-800 dark:text-parchment-50"
              }`}
            >
              {count}
            </div>
            <div className="mt-2 text-sm text-emerald-700/70 dark:text-parchment-100/60">
              / {target}
            </div>
            {done && (
              <div className="mt-2 text-xs font-bold text-neon-400">
                ✓ Selesai
              </div>
            )}
          </div>
        </button>

        {/* Progress ring (simplified bar) */}
        <div className="mt-5 h-2 w-48 overflow-hidden rounded-full bg-parchment-100 dark:bg-space-900 sm:w-56">
          <div
            className={`h-full rounded-full transition-all ${
              done
                ? "bg-gradient-to-r from-neon-500 to-neon-400"
                : "bg-gradient-to-r from-emerald-500 to-emerald-400"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Reset + stats */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={reset}
            disabled={!hydrated || count === 0}
            className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-parchment-50 disabled:opacity-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-emerald-700/70 dark:text-parchment-100/60">
          Total seumur hidup ({isCustom ? "Custom" : activePreset.label}):{" "}
          <span className="font-bold text-emerald-800 dark:text-parchment-50">
            {lifetimeTotal.toLocaleString("id-ID")}x
          </span>
        </div>
      </section>

      <p className="text-center text-xs text-emerald-700/60 dark:text-parchment-100/50">
        Tap lingkaran untuk menghitung. Data tersimpan otomatis di perangkat.
      </p>
    </div>
  );
}
