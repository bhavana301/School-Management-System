"use client";

import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function MovingBorder({ children, className, containerClassName }: MovingBorderProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl p-[1px]",
        "bg-[linear-gradient(var(--border-angle),transparent_30%,rgba(34,211,238,0.3)_50%,transparent_70%)] bg-[length:400%_400%]",
        "animate-[shimmer_8s_linear_infinite]",
        containerClassName
      )}
      style={
        {
          "--border-angle": "90deg",
        } as React.CSSProperties
      }
    >
      <div className={cn("rounded-xl bg-zinc-900 px-4 py-3", className)}>{children}</div>
    </div>
  );
}
