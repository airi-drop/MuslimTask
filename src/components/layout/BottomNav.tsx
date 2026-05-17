"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardCheck, BookOpen, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/amal", label: "Amal", icon: ClipboardCheck },
  { href: "/ibadah", label: "Ibadah", icon: BookOpen },
  { href: "/statistik", label: "Statistik", icon: BarChart2 },
  { href: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[430px]
        bg-bg-deep border-t border-green-dim/20
        flex z-50
        pb-safe
      "
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5",
              "min-h-[56px] font-ornament text-[10px] font-medium uppercase tracking-wide",
              "transition-colors duration-200",
              active ? "text-green-light" : "text-text-ghost"
            )}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.5} />
            <span>{label}</span>
            <span
              className={cn(
                "w-1 h-1 rounded-full bg-green-light transition-opacity",
                active ? "opacity-100" : "opacity-0"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
