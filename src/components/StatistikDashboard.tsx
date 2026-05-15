"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useT, type TKey } from "@/lib/i18n";
import {
  PRAYER_LABEL,
  buildSummary,
  getRecentDays,
  getWeekBars,
  intensity,
  pickHighlight,
  type DailyBar,
} from "@/lib/stats";
import { useMuslimState } from "@/lib/useMuslimState";
import { TARGET_PRAYERS_PER_DAY, type PrayerKey } from "@/lib/progress";

export function StatistikDashboard() {
  const { t } = useT();
  const { progress, hydrated } = useMuslimState();

  const week = useMemo(() => getWeekBars(progress), [progress]);
  const heatmap = useMemo(() => getRecentDays(progress, 30), [progress]);
  const summary = useMemo(() => buildSummary(progress), [progress]);
  const highlight = useMemo(() => pickHighlight(summary), [summary]);

  // Best day of the week
  const weekTotal = week.reduce((acc, d) => acc + d.prayedCount, 0);
  const weekTarget = week.length * TARGET_PRAYERS_PER_DAY;
  const weekPct = weekTarget ? Math.round((weekTotal / weekTarget) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow={t("statistik.eyebrow")}
        title={t("statistik.title")}
        description={t("statistik.description")}
        back={{ href: "/", label: "Dashboard" }}
      />

      {/* Highlight banner */}
      <section className="card-feature relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-neon-400/15 blur-3xl" />
        <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neon-400">
              {t("statistik.highlight")}
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-parchment-50 sm:text-3xl">
              {highlight.title}
            </h2>
            <p className="mt-2 text-sm text-parchment-100/80">
              {highlight.description}
            </p>
          </div>
          <div className="flex shrink-0 items-baseline gap-2 rounded-2xl bg-emerald-950/40 p-4 ring-1 ring-emerald-800/60">
            <span className="text-glow-amber font-display text-4xl font-bold sm:text-5xl">
              {summary.consistency30d}%
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-parchment-100/60">
              {t("statistik.days30")}
            </span>
          </div>
        </div>
      </section>

      {/* Week + Summary row */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <section className="card relative min-w-0 overflow-hidden p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600/70 dark:text-neon-500/70">
                {t("statistik.thisWeek")}
              </div>
              <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
                {t("statistik.prayerPerDay")}
              </h2>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-emerald-800 dark:text-parchment-50">
                {weekTotal}
                <span className="ml-1 text-base text-emerald-700/60 dark:text-parchment-100/60">
                  /{weekTarget}
                </span>
              </div>
              <div className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
                {weekPct}% {t("statistik.weekTarget")}
              </div>
            </div>
          </div>
          <WeekBars bars={week} />
        </section>

        <section className="card min-w-0 p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            {t("statistik.summary")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <Row
              label={t("statistik.totalPrayers30")}
              value={`${summary.totalPrayers30d} / ${summary.prayerTarget30d}`}
            />
            <Row
              label={t("statistik.perfectDays")}
              value={summary.perfectDays30d.toString()}
            />
            <Row
              label={t("statistik.incompleteDays")}
              value={summary.incompleteDays30d.toString()}
            />
            <Row label={t("statistik.xpMonth")} value={`${summary.xp30d} XP`} />
            {summary.bestPrayer && summary.bestPrayer.pct > 0 && (
              <Row
                label={t("statistik.mostConsistent")}
                value={`${PRAYER_LABEL[summary.bestPrayer.key]} (${summary.bestPrayer.pct}%)`}
              />
            )}
          </ul>
        </section>
      </div>

      {/* Per-prayer breakdown */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
          {t("statistik.perPrayer")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(summary.perPrayer30d) as PrayerKey[]).map((key) => {
            const pct = summary.perPrayer30d[key];
            const isBest = summary.bestPrayer?.key === key && pct > 0;
            return (
              <div
                key={key}
                className={`min-w-0 rounded-2xl border p-3 transition ${
                  isBest
                    ? "border-amber-400/60 bg-amber-400/5"
                    : "border-emerald-100 bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-parchment-100/70">
                    {PRAYER_LABEL[key]}
                  </span>
                  {isBest && (
                    <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                      Top
                    </span>
                  )}
                </div>
                <div
                  className={`mt-1 font-display text-2xl font-bold ${
                    isBest
                      ? "text-glow-amber"
                      : "text-emerald-800 dark:text-parchment-50"
                  }`}
                >
                  {pct}
                  <span className="text-base text-emerald-700/60 dark:text-parchment-100/60">
                    %
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-space-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isBest
                        ? "bg-gradient-to-r from-amber-400 to-amber-500"
                        : "bg-gradient-to-r from-emerald-500 to-neon-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Heatmap 30 hari */}
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            {t("statistik.heatmap")}
          </h2>
          <Legend t={t} />
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1 sm:grid-cols-15 lg:grid-cols-30">
          {heatmap.map((d) => (
            <HeatmapCell key={d.dateKey} day={d} />
          ))}
        </div>
        {!hydrated && (
          <p className="mt-3 text-xs text-emerald-700/60 dark:text-parchment-100/50">
            {t("statistik.loading")}
          </p>
        )}
      </section>
    </div>
  );
}

/* ---------- Week bars chart ---------- */

function WeekBars({ bars }: { bars: DailyBar[] }) {
  const max = TARGET_PRAYERS_PER_DAY;
  const todayKeyStr = bars.find(
    (d) => d.date.toDateString() === new Date().toDateString(),
  )?.dateKey;

  return (
    <div className="mt-6 grid grid-cols-7 items-end gap-1.5 sm:gap-3">
      {bars.map((d) => {
        const heightPct = (d.prayedCount / max) * 100;
        const isToday = d.dateKey === todayKeyStr;
        return (
          <div
            key={d.dateKey}
            className="flex min-w-0 flex-col items-center gap-2"
          >
            <div className="flex h-32 w-full items-end sm:h-40">
              <div
                className={`relative w-full overflow-hidden rounded-t-xl transition-all ${
                  d.perfect
                    ? "bg-gradient-to-t from-amber-400/90 to-amber-300"
                    : d.prayedCount > 0
                      ? "bg-gradient-to-t from-emerald-600 to-neon-400"
                      : "bg-emerald-100 dark:bg-emerald-900/40"
                }`}
                style={{
                  height: `${Math.max(d.prayedCount > 0 ? 8 : 4, heightPct)}%`,
                }}
              >
                {d.prayedCount > 0 && (
                  <span className="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-emerald-950">
                    {d.prayedCount}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`text-xs ${
                isToday
                  ? "font-bold text-emerald-700 dark:text-neon-400"
                  : "text-emerald-700/70 dark:text-parchment-100/60"
              }`}
            >
              {d.weekday}
              {isToday && (
                <span className="ml-1 inline-block h-1 w-1 rounded-full bg-neon-400 align-middle" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Heatmap cell + legend ---------- */

function HeatmapCell({ day }: { day: DailyBar }) {
  const level = intensity(day.prayedCount);
  const today = day.date.toDateString() === new Date().toDateString();

  const cls =
    level === 0
      ? "bg-parchment-200 dark:bg-space-900"
      : level === 1
        ? "bg-emerald-200 dark:bg-emerald-900/60"
        : level === 2
          ? "bg-emerald-400/80 dark:bg-emerald-700"
          : level === 3
            ? "bg-emerald-500 dark:bg-emerald-500"
            : "bg-gradient-to-br from-amber-400 to-amber-500 shadow-glow-amber";

  const dateLabel = day.date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  const tooltip = `${day.weekday}, ${dateLabel} · ${day.prayedCount}/${TARGET_PRAYERS_PER_DAY} salat`;

  return (
    <div
      title={tooltip}
      aria-label={tooltip}
      className={`aspect-square rounded-md transition-colors ${cls} ${
        today ? "ring-2 ring-neon-400 ring-offset-1 ring-offset-transparent" : ""
      }`}
    />
  );
}

function Legend({ t }: { t: (key: TKey) => string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
      <span>{t("statistik.less")}</span>
      <span className="h-3 w-3 rounded-sm bg-parchment-200 dark:bg-space-900" />
      <span className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
      <span className="h-3 w-3 rounded-sm bg-emerald-400/80 dark:bg-emerald-700" />
      <span className="h-3 w-3 rounded-sm bg-emerald-500" />
      <span className="h-3 w-3 rounded-sm bg-gradient-to-br from-amber-400 to-amber-500" />
      <span>{t("statistik.more")}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2 last:border-0 last:pb-0 dark:border-emerald-900/60">
      <span className="min-w-0 truncate text-emerald-700/80 dark:text-parchment-100/70">
        {label}
      </span>
      <span className="shrink-0 font-display text-lg font-bold text-emerald-800 dark:text-parchment-50">
        {value}
      </span>
    </li>
  );
}
