"use client";

import { useState } from "react";
import {
  renderShareCard,
  shareOrDownload,
  type ShareCardData,
} from "@/lib/share";

type Props = {
  data: () => ShareCardData;
  className?: string;
  /** Optional label override */
  label?: string;
};

export function ShareCardButton({ data, className = "", label }: Props) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setHint(null);
    try {
      const blob = await renderShareCard(data());
      const url = URL.createObjectURL(blob);
      setPreview(url);
      setOpen(true);
    } catch (e) {
      setHint(
        e instanceof Error
          ? e.message
          : "Gagal membuat gambar. Coba lagi nanti.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function shareNow() {
    if (!preview) return;
    setBusy(true);
    try {
      const res = await fetch(preview);
      const blob = await res.blob();
      const filename = `mihrab-streak-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      const result = await shareOrDownload(blob, filename);
      setHint(
        result === "shared"
          ? "Berhasil dibagikan!"
          : "Gambar berhasil diunduh ke perangkatmu.",
      );
    } catch (e) {
      setHint(
        e instanceof Error ? e.message : "Gagal membagikan.",
      );
    } finally {
      setBusy(false);
    }
  }

  function close() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setHint(null);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={generate}
        disabled={busy}
        className={`pill border border-emerald-100 bg-white text-emerald-700 transition hover:border-neon-500/40 hover:bg-parchment-50 hover:shadow-glow disabled:opacity-60 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:border-neon-500/40 ${className}`}
      >
        <ShareIcon className="h-4 w-4" />
        <span>{label ?? (busy ? "Memproses…" : "Bagikan Progress")}</span>
      </button>

      {open && preview && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-emerald-950/70 px-3 py-3 backdrop-blur sm:place-items-center sm:px-4"
          onClick={close}
        >
          <div
            className="card hud-frame max-h-[92vh] w-full max-w-md overflow-y-auto p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
                  Kartu Progressmu
                </h2>
                <p className="text-xs text-emerald-700/70 dark:text-parchment-100/60 sm:text-sm">
                  Bagikan ke story IG, status WA, atau simpan ke galeri.
                </p>
              </div>
              <button
                aria-label="Tutup"
                onClick={close}
                className="shrink-0 rounded-full p-1 text-emerald-700 hover:bg-parchment-100 dark:text-parchment-100 dark:hover:bg-space-900"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-emerald-100 dark:ring-emerald-900/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Pratinjau kartu progress"
                className="block w-full"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={shareNow}
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-3 font-semibold text-parchment-50 shadow-glow ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700 disabled:opacity-60"
              >
                <ShareIcon className="h-4 w-4" />
                <span className="truncate">
                  {busy ? "Memproses…" : "Bagikan / Simpan"}
                </span>
              </button>
              <button
                onClick={generate}
                disabled={busy}
                className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-parchment-50 disabled:opacity-60 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900"
              >
                Buat Ulang
              </button>
            </div>

            {hint && (
              <p className="mt-2 text-center text-xs text-emerald-700/80 dark:text-parchment-100/70">
                {hint}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v14" />
    </svg>
  );
}
