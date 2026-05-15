"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

type BackProps = {
  /** Where to navigate when tapped. */
  href: string;
  /** Label shown next to the arrow, e.g. "Mihrab". */
  label: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional back-link rendered above the eyebrow row. */
  back?: BackProps;
};

export function PageHeader({ eyebrow, title, description, back }: Props) {
  const { t } = useT();

  return (
    <header className="card hud-frame relative overflow-hidden p-5 sm:p-6">
      {/* Subtle radial accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-400/10 blur-2xl dark:bg-neon-400/20" />

      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-parchment-50 hover:shadow-glow dark:border-emerald-900/60 dark:bg-space-800/60 dark:text-parchment-100 dark:hover:bg-space-900"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>{t("common.back")} → {back.label}</span>
        </Link>
      )}

      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600/80 dark:text-neon-500/80">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-emerald-800 dark:text-parchment-50 sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-emerald-700/80 dark:text-parchment-100/70">
          {description}
        </p>
      )}
    </header>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
