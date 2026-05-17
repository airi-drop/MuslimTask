import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "gold" | "ghost" | "klaim";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-green-main to-green-mid
    text-text-primary font-semibold text-sm tracking-wide
    rounded-xl active:scale-[0.98] active:opacity-90
    transition-all duration-150
  `,
  gold: `
    bg-gradient-to-br from-gold-main to-gold-dim
    text-text-primary font-semibold text-sm
    rounded-xl active:scale-[0.98]
    transition-all duration-150
  `,
  ghost: `
    bg-transparent text-green-light font-medium text-sm
    border border-green-dim rounded-xl
    active:bg-green-dim/10
    transition-all duration-150
  `,
  klaim: `
    bg-gradient-to-br from-green-main to-green-mid
    text-text-primary font-bold text-[11px] tracking-wider uppercase
    rounded-lg px-4 active:scale-[0.98]
    transition-all duration-150
  `,
};

export default function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "min-h-[48px] min-w-[48px] flex items-center justify-center",
        fullWidth && "w-full",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
