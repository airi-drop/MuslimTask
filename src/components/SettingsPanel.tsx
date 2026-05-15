"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  CALC_METHOD_DESC,
  CALC_METHOD_LABEL,
  DEFAULT_SETTINGS,
  MADHAB_LABEL,
  QARI_LABEL,
  loadSettings,
  saveSettings,
  type CalcMethod,
  type Madhab,
  type Qari,
  type Settings,
} from "@/lib/settings";

export function SettingsPanel() {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setS(loadSettings());
    setHydrated(true);
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...s, [key]: value };
    setS(next);
    saveSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Pengaturan"
        title="Pengaturan"
        description="Sesuaikan nama, metode hisab, qari, notifikasi, dan getaran."
        back={{ href: "/", label: "Dashboard" }}
      />

      {saved && (
        <div className="rounded-2xl border border-neon-400/40 bg-neon-400/10 px-4 py-2 text-xs font-semibold text-neon-700 dark:text-neon-300">
          Tersimpan ✓
        </div>
      )}

      {/* Profile */}
      <Section
        title="Profil"
        desc="Nama yang dipakai pada salam dan kartu share."
      >
        <label className="block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            Nama panggilan
          </span>
          <input
            type="text"
            value={s.username}
            onChange={(e) => update("username", e.target.value)}
            disabled={!hydrated}
            placeholder="Musafir"
            maxLength={32}
            className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-emerald-800 placeholder:text-emerald-700/40 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50 dark:placeholder:text-parchment-100/40"
          />
          <p className="mt-1 text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
            Kosongkan untuk pakai default &quot;Musafir&quot;.
          </p>
        </label>
      </Section>

      {/* Prayer calculation */}
      <Section
        title="Perhitungan Jadwal Salat"
        desc="Metode hisab menentukan sudut Subuh & Isya. Hasil bisa berbeda 1-3 menit antar metode."
      >
        <label className="block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            Metode hisab
          </span>
          <select
            value={s.calcMethod}
            onChange={(e) => update("calcMethod", e.target.value as CalcMethod)}
            disabled={!hydrated}
            className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
          >
            {(Object.keys(CALC_METHOD_LABEL) as CalcMethod[]).map((m) => (
              <option key={m} value={m}>
                {CALC_METHOD_LABEL[m]}
              </option>
            ))}
          </select>
          <p className="mt-1 break-words text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            {CALC_METHOD_DESC[s.calcMethod]}
          </p>
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            Madzhab Ashar
          </span>
          <select
            value={s.madhab}
            onChange={(e) => update("madhab", e.target.value as Madhab)}
            disabled={!hydrated}
            className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
          >
            {(Object.keys(MADHAB_LABEL) as Madhab[]).map((m) => (
              <option key={m} value={m}>
                {MADHAB_LABEL[m]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            Hanafi: bayang 2x panjang benda. Lainnya: 1x.
          </p>
        </label>
      </Section>

      {/* Quran */}
      <Section
        title="Al-Quran"
        desc="Preferensi saat membaca Al-Quran."
      >
        <label className="block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            Qari (audio)
          </span>
          <select
            value={s.qari}
            onChange={(e) => update("qari", e.target.value as Qari)}
            disabled={!hydrated}
            className="mt-1 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
          >
            {(Object.keys(QARI_LABEL) as Qari[]).map((q) => (
              <option key={q} value={q}>
                {QARI_LABEL[q]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            Audio surah yang sudah didengar tersimpan offline.
          </p>
        </label>

        <Toggle
          label="Tampilkan latin"
          desc="Default tampilan transliterasi Latin saat membuka surah."
          checked={s.showLatin}
          onChange={(v) => update("showLatin", v)}
          disabled={!hydrated}
        />
      </Section>

      {/* Notifications & Feedback */}
      <Section
        title="Notifikasi & Umpan Balik"
        desc="Pengingat dan umpan balik fisik."
      >
        <Toggle
          label="Pengingat waktu salat"
          desc="Tampilkan notifikasi saat masuk waktu salat (hanya saat aplikasi terbuka)."
          checked={s.notifications}
          onChange={(v) => update("notifications", v)}
          disabled={!hydrated}
        />
        <Toggle
          label="Getaran"
          desc="Getarkan perangkat saat menghitung dzikir / tasbih (jika didukung)."
          checked={s.vibrate}
          onChange={(v) => update("vibrate", v)}
          disabled={!hydrated}
        />
      </Section>

      {/* Hijri note */}
      <Section
        title="Catatan Tanggal Hijriah"
        desc="Tanggal Hijriah di aplikasi ini menggunakan kalender Umm Al-Qura (hisab) yang dapat berbeda 1 hari dengan rukyat resmi Kemenag Indonesia, terutama saat awal/akhir bulan."
      >
        <p className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
          Untuk awal Ramadhan, Syawal, dan Zulhijjah, selalu rujuk pengumuman
          resmi sidang isbat.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-1 text-xs text-emerald-700/70 dark:text-parchment-100/60 sm:text-sm">
          {desc}
        </p>
      )}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">
          {label}
        </div>
        {desc && (
          <p className="mt-0.5 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            {desc}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
          checked
            ? "bg-gradient-to-r from-emerald-500 to-neon-400 shadow-glow"
            : "bg-parchment-200 dark:bg-space-900"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
