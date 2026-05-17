'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { loadProgress } from '@/lib/progress';
import { getWeekBars, buildSummary, PRAYER_LABEL, PRAYER_KEYS } from '@/lib/stats';
import type { Progress, PrayerKey } from '@/lib/progress';
import type { StatsSummary } from '@/lib/stats';

type TimeRange = 'week' | 'month' | 'alltime';

interface ChartPoint {
  day: string;
  xp: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-surface border border-text-ghost/30 rounded-lg p-2">
      <p className="font-ui text-[10px] text-text-muted">{label}</p>
      <p className="font-display text-sm text-text-primary">
        {payload[0].value} XP
      </p>
    </div>
  );
}

export default function StatistikPage() {
  const [range, setRange] = useState<TimeRange>('week');
  const [progress, setProgress] = useState<Progress | null>(null);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setSummary(buildSummary(p));
    const bars = getWeekBars(p);
    setChartData(bars.map((b) => ({ day: b.weekday, xp: b.xp })));
  }, []);

  const hasData =
    progress && Object.keys(progress.history).length > 0;

  const toggleButtons: { key: TimeRange; label: string }[] = [
    { key: 'week', label: 'Minggu Ini' },
    { key: 'month', label: 'Bulan Ini' },
    { key: 'alltime', label: 'All Time' },
  ];

  // Get prayer bar color based on percentage
  function getPrayerBarColor(pct: number): string {
    if (pct >= 70) return 'bg-green-main';
    if (pct >= 40) return 'bg-gold-main';
    return 'bg-[#C47A3A]';
  }

  return (
    <div className="px-5 py-6 space-y-5 pb-24">
      {/* Header */}
      <div>
        <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted">
          STATISTIK
        </p>
        <h1 className="font-display text-xl text-text-primary">
          Performa Ibadah
        </h1>
      </div>

      {/* Toggle Row */}
      <div className="flex gap-2">
        {toggleButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setRange(btn.key)}
            className={cn(
              'flex-1 py-2 rounded-xl text-[10px] font-ui font-medium border transition-colors',
              range === btn.key
                ? 'bg-green-main/10 border-green-main text-green-light'
                : 'bg-bg-surface border-text-ghost/30 text-text-muted'
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {hasData ? (
        <>
          {/* Amal Score Area Chart */}
          <Card className="p-4">
            <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-3">
              AMAL SCORE
            </p>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="rgba(58, 138, 82, 0.3)"
                      />
                      <stop
                        offset="100%"
                        stopColor="rgba(58, 138, 82, 0.0)"
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fill: 'var(--color-text-muted, #335A3E)',
                      fontFamily: 'var(--font-ui)',
                    }}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="#3A8A52"
                    strokeWidth={2}
                    fill="url(#xpGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Prayer Timing Breakdown */}
          {summary && (
            <Card className="p-4">
              <p className="font-ornament text-[9px] uppercase tracking-widest text-text-muted mb-4">
                BREAKDOWN SALAT
              </p>
              <div className="space-y-3">
                {(PRAYER_KEYS as readonly PrayerKey[]).map((key) => {
                  const pct = summary.perPrayer30d[key];
                  const isBest =
                    summary.bestPrayer?.key === key;
                  const isWorst =
                    summary.worstPrayer?.key === key &&
                    summary.worstPrayer.key !== summary.bestPrayer?.key;

                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="font-ui text-xs text-text-primary w-16">
                        {PRAYER_LABEL[key]}
                      </span>
                      <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            getPrayerBarColor(pct)
                          )}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="font-ui text-[10px] text-text-muted w-8 text-right">
                        {pct}%
                      </span>
                      {isBest && (
                        <span className="text-[8px] text-green-light whitespace-nowrap">
                          Paling konsisten
                        </span>
                      )}
                      {isWorst && (
                        <span className="text-[8px] text-gold-main whitespace-nowrap">
                          Perlu ditingkatkan
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <p className="font-ui text-sm text-text-secondary text-center">
            Mulai hari ini, setiap ibadahmu akan tercatat di sini.
          </p>
          <Link href="/amal">
            <Button variant="primary">Mulai Sekarang</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
