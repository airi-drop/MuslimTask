"use client";

import { useEffect, useState } from "react";
import {
  type Location,
  PRESET_CITIES,
  requestGps,
} from "@/lib/location";

type Props = {
  open: boolean;
  current: Location;
  onClose: () => void;
  onPick: (loc: Location) => void;
};

export function LocationPicker({ open, current, onClose, onPick }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  if (!open) return null;

  async function handleGps() {
    setLoading(true);
    setError(null);
    const res = await requestGps();
    setLoading(false);
    if (res.ok) {
      onPick(res.location);
      onClose();
    } else {
      setError(res.error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-emerald-950/60 px-3 py-3 sm:place-items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="card hud-frame max-h-[90vh] w-full max-w-md overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
              Pilih Lokasi
            </h2>
            <p className="text-xs text-emerald-700/70 dark:text-parchment-100/60 sm:text-sm">
              Lokasi dipakai untuk menghitung jadwal salat secara offline.
            </p>
          </div>
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="shrink-0 rounded-full p-1 text-emerald-700 hover:bg-parchment-100 dark:text-parchment-100 dark:hover:bg-space-900"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleGps}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-3 font-semibold text-parchment-50 shadow-glow ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
            <circle cx="12" cy="9" r="3" />
          </svg>
          <span className="truncate">
            {loading ? "Mendeteksi lokasi…" : "Gunakan Lokasi GPS Saat Ini"}
          </span>
        </button>

        {error && <p className="mt-2 text-sm text-amber-500">{error}</p>}

        <div className="mt-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-600/70 dark:text-neon-500/70">
            Kota Populer
          </div>
          <ul className="space-y-1">
            {PRESET_CITIES.map((c) => {
              const active =
                current.latitude === c.latitude &&
                current.longitude === c.longitude;
              return (
                <li key={`${c.city}-${c.latitude}`}>
                  <button
                    onClick={() => {
                      onPick(c);
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-parchment-50"
                        : "hover:bg-parchment-50 dark:hover:bg-space-900"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-emerald-800 dark:text-parchment-50">
                        {c.city}
                      </div>
                      <div className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
                        {c.region}
                      </div>
                    </div>
                    {active && (
                      <span className="shrink-0 text-xs font-semibold text-neon-600 dark:text-neon-400">
                        Aktif
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
