"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { SkylineSVG } from "./SkylineSVG";
import { MatrixRain } from "./MatrixRain";

interface GlowBackgroundProps {
  variant?: "hero" | "top" | "subtle" | "none";
  showSkyline?: boolean;
  showGrid?: boolean;
  showRain?: boolean;
  showScanlines?: boolean;
  portalRole?: "judge" | "mentor" | "shared";
  className?: string;
  children?: React.ReactNode;
}

export function GlowBackground({
  variant = "hero",
  showSkyline = false,
  showGrid = true,
  showRain = false,
  showScanlines = false,
  portalRole = "shared",
  className,
  children,
}: GlowBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-bg", className)}>
      {/* 1. Dual Corner Glows (Pink bottom-left + Green top-right) */}
      {variant === "hero" && (
        <>
          {/* Bottom-Left Pink Radial (Human voice) */}
          <div
            className="pointer-events-none absolute -bottom-[10vh] -left-[10vw] w-[65vw] h-[65vh] rounded-full blur-[70px] animate-drift-slow z-0"
            style={{
              background:
                "radial-gradient(circle at 35% 65%, rgba(255, 46, 154, 0.28) 0%, rgba(123, 63, 242, 0.15) 45%, rgba(2, 4, 10, 0) 80%)",
            }}
          />

          {/* Top-Right Green Radial (Machine voice) */}
          <div
            className="pointer-events-none absolute -top-[10vh] -right-[10vw] w-[60vw] h-[60vh] rounded-full blur-[70px] animate-drift-reverse z-0"
            style={{
              background:
                "radial-gradient(circle at 65% 35%, rgba(0, 255, 65, 0.22) 0%, rgba(34, 211, 238, 0.12) 45%, rgba(2, 4, 10, 0) 80%)",
            }}
          />

          {/* Central subtle breathing glow with gradient */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[55vh] rounded-full blur-[90px] animate-glow-breathe z-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(123, 63, 242, 0.08) 0%, rgba(34, 211, 238, 0.05) 40%, rgba(2, 4, 10, 0) 75%)",
            }}
          />
        </>
      )}

      {variant === "top" && (
        <>
          {/* Auth top glow anchored based on portal role */}
          <div
            className="pointer-events-none absolute -top-[15vh] left-1/2 -translate-x-1/2 w-[110vw] h-[60vh] rounded-full blur-[60px] animate-glow-breathe z-0"
            style={{
              background:
                portalRole === "judge"
                  ? "radial-gradient(60% 55% at 50% 0%, rgba(255, 46, 154, 0.24) 0%, rgba(123, 63, 242, 0.14) 40%, rgba(2, 4, 10, 0) 80%)"
                  : portalRole === "mentor"
                  ? "radial-gradient(60% 55% at 50% 0%, rgba(0, 255, 65, 0.22) 0%, rgba(34, 211, 238, 0.14) 40%, rgba(2, 4, 10, 0) 80%)"
                  : "radial-gradient(60% 55% at 50% 0%, rgba(255, 46, 154, 0.18) 0%, rgba(0, 255, 65, 0.14) 50%, rgba(2, 4, 10, 0) 80%)",
            }}
          />
        </>
      )}

      {variant === "subtle" && (
        <div
          className="pointer-events-none absolute -top-[10vh] right-[5vw] w-[50vw] h-[40vh] rounded-full blur-[70px] z-0"
          style={{
            background:
              portalRole === "judge"
                ? "radial-gradient(circle at 50% 50%, rgba(255, 46, 154, 0.12) 0%, rgba(2, 4, 10, 0) 70%)"
                : portalRole === "mentor"
                ? "radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.10) 0%, rgba(2, 4, 10, 0) 70%)"
                : "radial-gradient(circle at 50% 50%, rgba(255, 46, 154, 0.08) 0%, rgba(0, 255, 65, 0.06) 60%, rgba(2, 4, 10, 0) 80%)",
          }}
        />
      )}

      {/* 2. Optional Matrix Rain Layer (Landing & Login only) */}
      {showRain && <MatrixRain opacity={0.08} />}

      {/* 3. Optional 2% Scanline Overlay (Landing & Login only) */}
      {showScanlines && <div className="scanlines-overlay" />}

      {/* 4. Film Grain Overlay */}
      <svg
        className="film-grain-overlay"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <filter id="film-grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-noise)" />
      </svg>

      {/* 5. Faint Grid with Radial Mask */}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 20%, rgba(0,0,0,0.5) 60%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, black 20%, rgba(0,0,0,0.5) 60%, transparent 90%)",
          }}
        />
      )}

      {/* 6. Optional Skyline Silhouette with pink/green rim */}
      {showSkyline && <SkylineSVG opacity={0.35} />}

      {/* 7. Foreground Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
    </div>
  );
}
