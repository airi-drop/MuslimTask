import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  /** Small sub-label like "hari" or "Terbaik: 0 hari" */
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: "default" | "gold";
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
  return (
    <div
      className={`stat-tile flex flex-col gap-2 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <div
        className={`flex w-full items-center ${
          align === "center" ? "justify-center" : "justify-between"
        } gap-2`}
      >
        <span className="text-xs font-semibold text-forest-700/80">
          {label}
        </span>
        {icon && (
          <span
            className={`grid h-8 w-8 place-items-center rounded-full ${
              accent === "gold"
                ? "bg-gold-500/15 text-gold-500"
                : "bg-forest-100 text-forest-700"
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-bold text-forest-800">
        {value}
      </div>
      {sub && (
        <div className="text-xs text-forest-500/80">{sub}</div>
      )}
    </div>
  );
}
