import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  color?: "green" | "gold";
  height?: "xs" | "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  color = "green",
  height = "sm",
  className,
}: ProgressBarProps) {
  const heights = { xs: "h-0.5", sm: "h-1", md: "h-1.5" };
  const fills = {
    green: "bg-gradient-to-r from-green-mid to-green-glow",
    gold: "bg-gradient-to-r from-gold-dim to-gold-light",
  };

  return (
    <div
      className={cn(
        "w-full bg-bg-surface rounded-full overflow-hidden",
        heights[height],
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", fills[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
