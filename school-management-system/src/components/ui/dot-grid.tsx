"use client";

import { cn } from "@/lib/utils";

interface DotGridProps {
  className?: string;
}

export function DotGrid({ className }: DotGridProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#a1a1aa22_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa22_1px,transparent_1px)] bg-[size:24px_24px]",
        className
      )}
    />
  );
}
