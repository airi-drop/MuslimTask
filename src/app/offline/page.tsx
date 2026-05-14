import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline — MuslimTask",
};

export default function OfflinePage() {
  return (
    <div className="card hud-frame relative mx-auto max-w-xl overflow-hidden p-6 text-center sm:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-neon-400 shadow-glow">
        <svg
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 8.5C5 6 8.5 4.5 12 4.5s7 1.5 10 4M5 12c2-1.5 4.5-2.5 7-2.5s5 1 7 2.5M8.5 15.5C10 14.7 11 14.3 12 14.3s2 .4 3.5 1.2M12 19.5h.01" />
          <path d="M3 3l18 18" />
        </svg>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-neon-500/80">
        Offline Mode
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-emerald-800 dark:text-parchment-50 sm:text-4xl">
        Tidak ada koneksi
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-emerald-700/80 dark:text-parchment-100/70">
        Kamu sedang offline, tapi tenang — semua quest, dzikir, dan jadwal
        salat tetap bisa diakses. Halaman yang sudah dibuka akan tersimpan
        dan tetap bisa dibuka tanpa internet.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <a
          href="/"
          className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-5 py-3 text-sm font-semibold text-parchment-50 shadow-glow ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700"
        >
          Coba Lagi
        </a>
        <a
          href="/quest"
          className="rounded-2xl border border-emerald-100 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100 dark:hover:bg-space-900"
        >
          Buka Quest
        </a>
      </div>
    </div>
  );
}
