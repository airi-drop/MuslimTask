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
      className="fixed inset-0 z-50 grid place-items-center bg-forest-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-forest-800">
              Pilih Lokasi
            </h2>
            <p className="text-sm text-forest-500/80">
              Lokasi dipakai untuk menghitung jadwal salat secara offline.
            </p>
          </div>
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="rounded-full p-1 text-forest-700 hover:bg-cream-100"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleGps}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 px-4 py-3 font-semibold text-cream-50 shadow-card hover:bg-forest-600 disabled:opacity-60"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z" />
            <circle cx="12" cy="9" r="3" />
          </svg>
          {loading ? "Mendeteksi lokasi…" : "Gunakan Lokasi GPS Saat Ini"}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-forest-500/70">
            Kota Populer
          </div>
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
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
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-forest-100 text-forest-800"
                        : "hover:bg-cream-100"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-forest-800">
                        {c.city}
                      </div>
                      <div className="text-xs text-forest-500/80">
                        {c.region}
                      </div>
                    </div>
                    {active && (
                      <span className="text-sm font-semibold text-forest-600">
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
