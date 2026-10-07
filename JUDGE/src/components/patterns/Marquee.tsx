"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface MarqueeProps {
  label?: string;
  items?: string[];
  className?: string;
}

const DEFAULT_ITEMS = [
  "INNOVATORS & VISIONARIES CLUB",
  "VICEVERSE '26 JURY CONSENSUS",
  "AI & INTELLIGENT SYSTEMS",
  "FULL STACK WEB3 & DEPIN",
  "SUSTAINABLE COMPUTING",
  "CYBERSECURITY ARCHITECTURE",
  "AUTONOMOUS ROBOTICS",
];

export function Marquee({
  label = "POWERED BY",
  items = DEFAULT_ITEMS,
  className,
}: MarqueeProps) {
  return (
    <div className={cn("w-full py-6 select-none overflow-hidden", className)}>
      {label && (
        <div className="flex items-center justify-center gap-2 mb-4 font-mono text-[11px] uppercase tracking-widest text-text-faint">
          <span className="w-4 h-[1px] bg-border-strong" />
          <span>{label}</span>
          <span className="w-4 h-[1px] bg-border-strong" />
        </div>
      )}

      {/* Marquee Track with Mask Gradient Fades on Left and Right */}
      <div
        className="relative w-full overflow-hidden flex"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex gap-12 shrink-0 animate-marquee hover:[animation-play-state:paused] py-1">
          {items.map((item, idx) => (
            <div
              key={`a-${idx}`}
              className="flex items-center gap-3 font-mono text-xs text-text-muted hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Duplicate track for seamless infinite scroll */}
        <div
          aria-hidden="true"
          className="flex gap-12 shrink-0 animate-marquee hover:[animation-play-state:paused] py-1"
        >
          {items.map((item, idx) => (
            <div
              key={`b-${idx}`}
              className="flex items-center gap-3 font-mono text-xs text-text-muted hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
