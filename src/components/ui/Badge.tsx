import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "rank"
  | "streak"
  | "xp"
  | "tier-common"
  | "tier-mid"
  | "tier-rare"
  | "tier-legendary";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  rank: "bg-gold-main/12 border border-gold-main/25 text-gold-light font-ornament text-[9px] tracking-widest",
  streak: "bg-green-main/10 border border-green-dim/40 text-green-light font-semibold text-[11px]",
  xp: "bg-green-main/10 border border-green-mid/40 text-green-light font-bold text-[10px]",
  "tier-common": "bg-bg-surface border border-text-ghost/30 text-text-muted text-[9px]",
  "tier-mid": "bg-green-main/8 border border-green-dim/40 text-green-light text-[9px]",
  "tier-rare": "bg-gold-main/10 border border-gold-main/25 text-gold-light text-[9px]",
  "tier-legendary":
    "bg-gradient-to-r from-green-mid/15 to-gold-dim/15 border border-green-light/30 text-green-glow text-[9px]",
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
