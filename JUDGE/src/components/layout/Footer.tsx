"use client";

import React from "react";
import { GradientStrip } from "@/components/brand/GradientStrip";

export function Footer() {
  return (
    <footer className="w-full mt-auto bg-bg-elevated/60 border-t border-border">
      <GradientStrip height="hairline" withGlow={true} className="my-0" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Tagline with alternating pink and green dots */}
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono tracking-wider uppercase">
          <span>Ideate</span>
          <span className="text-accent font-bold text-sm">&bull;</span>
          <span>Visualize</span>
          <span className="text-signal font-bold text-sm">&bull;</span>
          <span>Create</span>
        </div>

        {/* Center: System Voice / Copyright */}
        <div className="text-center font-mono text-[11px] text-text-faint">
          <span>&copy; 2026 ViceVerse &bull; Innovators &amp; Visionaries Club (IVC)</span>
        </div>

        {/* Right: Node Online status with green dot */}
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal shadow-[0_0_8px_var(--signal)]" />
          </span>
          <span className="text-signal font-medium">Node Online</span>
          <span className="text-text-faint text-[10px]">v3.2</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
