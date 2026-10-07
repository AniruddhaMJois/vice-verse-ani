"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface GradientStripProps {
  height?: "hairline" | "thin" | "band";
  withGlow?: boolean;
  className?: string;
}

export function GradientStrip({
  height = "hairline",
  withGlow = true,
  className,
}: GradientStripProps) {
  const heightClass =
    height === "hairline" ? "h-[1px]" : height === "thin" ? "h-[2px]" : "h-6 sm:h-12";

  return (
    <div className={cn("relative w-full overflow-hidden my-4", className)}>
      {/* Blurred glow duplicate */}
      {withGlow && (
        <div
          className={cn(
            "absolute inset-0 w-full blur-[6px] opacity-75 pointer-events-none",
            heightClass
          )}
          style={{
            background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
          }}
        />
      )}
      {/* Sharp dual-accent gradient bar */}
      <div
        className={cn("relative w-full z-10", heightClass)}
        style={{
          background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
        }}
      />
    </div>
  );
}
