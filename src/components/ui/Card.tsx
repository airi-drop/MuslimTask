import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "base" | "elevated" | "gold";

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<CardVariant, string> = {
  base: `
    bg-bg-surface border border-text-ghost/30
    rounded-xl p-4
  `,
  elevated: `
    bg-gradient-to-br from-bg-raised to-bg-mid
    border border-green-dim/40 rounded-xl p-4
    relative overflow-hidden
    before:absolute before:top-0 before:left-0 before:right-0
    before:h-px before:bg-gradient-to-r
    before:from-transparent before:via-green-light/40 before:to-transparent
  `,
  gold: `
    bg-gold-main/5 border border-gold-main/25
    rounded-xl p-4
  `,
};

export default function Card({ variant = "base", children, className }: CardProps) {
  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
}
