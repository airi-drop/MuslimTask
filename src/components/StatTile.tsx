import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: "default" | "amber" | "neon";
  align?: "left" | "center";
};

export function StatTile({
  label,
  value,
  sub,
  icon,
  accent = "default",
  align = "left",
}: Props) {
  const iconBg =
    accent === "amber"
      ? "bg-amber-400/15 text-amber-500"
      : accent === "neon"
        ? "bg-neon-500/15 text-neon-500"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400";

  return (
    <div
      className={`stat-tile flex min-w-0 flex-col gap-2 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <div
        className={`flex w-full items-center gap-2 ${
          align === "center" ? "justify-center" : "justify-between"
        }`}
      >
        <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-parchment-100/70 sm:text-xs">
          {label}
        </span>
        {icon && (
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full sm:h-8 sm:w-8 ${iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="break-words font-display text-2xl font-bold text-emerald-800 dark:text-parchment-50 sm:text-3xl">
        {value}
      </div>
      {sub && (
        <div className="truncate text-[11px] text-emerald-600/80 dark:text-parchment-100/60 sm:text-xs">
          {sub}
        </div>
      )}
    </div>
  );
}
