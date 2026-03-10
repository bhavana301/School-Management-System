"use client";

import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
  onClick?: () => void;
}

export function GlowCard({ children, className, glowClassName, onClick }: GlowCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-cyan-300 hover:shadow-md",
        className,
        onClick && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          "bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5",
          glowClassName
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
