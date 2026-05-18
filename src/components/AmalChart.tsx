"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

export function AmalChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(58, 138, 82, 0.3)" />
              <stop offset="100%" stopColor="rgba(58, 138, 82, 0.0)" />
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
  );
}
