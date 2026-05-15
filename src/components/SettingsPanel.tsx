"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useT } from "@/lib/i18n";
import {
  CALC_METHOD_DESC,
  CALC_METHOD_LABEL,
  DEFAULT_SETTINGS,
  LANGUAGE_LABEL,
  MADHAB_LABEL,
  loadSettings,
  saveSettings,
  type CalcMethod,
  type Language,
  type Madhab,
  type Settings,
} from "@/lib/settings";

export function SettingsPanel() {
  const { t } = useT();
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Profile draft state — only persisted on Save click.
  const [draftName, setDraftName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setS(loaded);
    setDraftName(loaded.username);
    setHydrated(true);
  }, []);

  /** Persist a single key immediately (used for non-profile fields). */
  function commit<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...s, [key]: value };
    setS(next);
    saveSettings(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function saveProfile() {
    const next = { ...s, username: draftName.trim() };
    setS(next);
    saveSettings(next);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  const profileDirty = draftName.trim() !== s.username;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        description={t("settings.description")}
        back={{ href: "/", label: t("nav.dashboard") }}
      />

      {savedFlash && (
        <div className="flex items-center gap-2 rounded-2xl border border-neon-400/40 bg-neon-400/10 px-4 py-2.5">
          <CheckCircleIcon className="h-4 w-4 text-neon-600 dark:text-neon-400" />
          <span className="text-xs font-semibold text-neon-700 dark:text-neon-300">
            {t("settings.changesSaved")}
          </span>
        </div>
      )}

      {/* Language */}
      <Section icon={<GlobeIcon />} title={t("settings.langTitle")} desc={t("settings.langDesc")}>
        <div className="flex gap-2">
          {(Object.keys(LANGUAGE_LABEL) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => commit("language", lang)}
              disabled={!hydrated}
              className={`flex-1 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                s.language === lang
                  ? "border-emerald-500 bg-emerald-700 text-parchment-50 shadow-glow"
                  : "border-emerald-100 bg-white text-emerald-700 hover:border-emerald-200 dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-100 dark:hover:border-emerald-700"
              }`}
            >
              <span className="text-lg">{lang === "id" ? "🇮🇩" : "🇬🇧"}</span>
              <div className="mt-1">{LANGUAGE_LABEL[lang]}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Profile (with explicit Save) */}
      <Section icon={<UserIcon />} title={t("settings.profileTitle")} desc={t("settings.profileDesc")}>
        <label className="block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            {t("settings.nameLabel")}
          </span>
          <input
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            disabled={!hydrated}
            placeholder="Musafir"
            maxLength={32}
            className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800 placeholder:text-emerald-700/40 focus:border-neon-400 focus:outline-none focus:ring-2 focus:ring-neon-400/20 dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50 dark:placeholder:text-parchment-100/40"
          />
          <p className="mt-1.5 text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
            {t("settings.nameHint")}
          </p>
        </label>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
            {profileSaved ? (
              <span className="font-semibold text-neon-600 dark:text-neon-400">
                ✓ {t("common.saved")}
              </span>
            ) : (
              t("settings.profileSaveHint")
            )}
          </span>
          <button
            onClick={saveProfile}
            disabled={!hydrated || !profileDirty}
            className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-5 py-2 text-sm font-bold text-parchment-50 shadow-glow ring-1 ring-emerald-700 transition hover:from-emerald-500 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("common.save")}
          </button>
        </div>
      </Section>

      {/* Prayer calculation */}
      <Section icon={<MosqueIcon />} title={t("settings.prayerTitle")} desc={t("settings.prayerDesc")}>
        <label className="block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            {t("settings.calcLabel")}
          </span>
          <select
            value={s.calcMethod}
            onChange={(e) => commit("calcMethod", e.target.value as CalcMethod)}
            disabled={!hydrated}
            className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none focus:ring-2 focus:ring-neon-400/20 dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
          >
            {(Object.keys(CALC_METHOD_LABEL) as CalcMethod[]).map((m) => (
              <option key={m} value={m}>
                {CALC_METHOD_LABEL[m]}
              </option>
            ))}
          </select>
          <p className="mt-1.5 break-words text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            {CALC_METHOD_DESC[s.calcMethod]}
          </p>
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-semibold text-emerald-700/80 dark:text-parchment-100/70">
            {t("settings.madhabLabel")}
          </span>
          <select
            value={s.madhab}
            onChange={(e) => commit("madhab", e.target.value as Madhab)}
            disabled={!hydrated}
            className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-800 focus:border-neon-400 focus:outline-none focus:ring-2 focus:ring-neon-400/20 dark:border-emerald-900/60 dark:bg-space-900 dark:text-parchment-50"
          >
            {(Object.keys(MADHAB_LABEL) as Madhab[]).map((m) => (
              <option key={m} value={m}>
                {MADHAB_LABEL[m]}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
            {t("settings.madhabHint")}
          </p>
        </label>
      </Section>

      {/* Notifications & Feedback */}
      <Section icon={<BellIcon />} title={t("settings.notifTitle")} desc={t("settings.notifDesc")}>
        <Toggle
          label={t("settings.prayerNotifLabel")}
          desc={t("settings.prayerNotifDesc")}
          checked={s.notifications}
          onChange={(v) => commit("notifications", v)}
          disabled={!hydrated}
        />
        <Toggle
          label={t("settings.vibrateLabel")}
          desc={t("settings.vibrateDesc")}
          checked={s.vibrate}
          onChange={(v) => commit("vibrate", v)}
          disabled={!hydrated}
        />
      </Section>

      {/* About */}
      <Section icon={<InfoIcon />} title={t("settings.aboutTitle")} desc={t("settings.aboutDesc")}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-700/80 dark:text-parchment-100/70">{t("settings.version")}</span>
            <span className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-700/80 dark:text-parchment-100/70">{t("settings.storage")}</span>
            <span className="text-sm font-semibold text-emerald-800 dark:text-parchment-50">localStorage</span>
          </div>
          <p className="text-[11px] text-emerald-700/60 dark:text-parchment-100/50">
            {t("settings.hijriNote")}
          </p>
        </div>
      </Section>
    </div>
  );
}

/* ─── Section with icon ─── */

function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-start gap-4 border-b border-emerald-100 px-5 py-4 dark:border-emerald-900/40 sm:px-6">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
            {title}
          </h2>
          {desc && (
            <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-parchment-100/60">
              {desc}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4 px-5 py-4 sm:px-6 sm:py-5">{children}</div>
    </section>
  );
}

/* ─── Toggle ─── */

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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-50 bg-parchment-50/50 px-4 py-3 dark:border-emerald-900/30 dark:bg-space-900/40">
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
        className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
          checked
            ? "bg-gradient-to-r from-emerald-500 to-neon-400 shadow-glow"
            : "bg-parchment-200 dark:bg-space-800"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ─── Icons ─── */

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function MosqueIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V10a8 8 0 0 1 16 0v11" />
      <path d="M8 21v-5a4 4 0 0 1 8 0v5" />
      <path d="M12 3v3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
