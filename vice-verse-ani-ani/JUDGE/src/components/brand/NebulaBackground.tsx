"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import HalftoneNebula from "@/components/ui/halftone-nebula";
import { useNebulaPalette, NebulaVariant } from "@/lib/useNebulaPalette";

export function getVariantForPath(pathname: string | null): NebulaVariant {
  if (!pathname || pathname === "/") return "landing";
  if (pathname === "/judge/login" || pathname === "/judge/login/") return "judge-auth";
  if (pathname === "/mentor/login" || pathname === "/mentor/login/") return "mentor-auth";
  if (pathname.startsWith("/judge")) return "judge-data";
  if (pathname.startsWith("/mentor")) return "mentor-data";
  return "landing";
}

interface NebulaBackgroundProps {
  className?: string;
  // Optional override if needed for testing or isolation
  forceVariant?: NebulaVariant;
}

export function NebulaBackground({ className = "", forceVariant }: NebulaBackgroundProps) {
  const pathname = usePathname();
  const targetVariant = forceVariant ?? getVariantForPath(pathname);

  const [activeVariant, setActiveVariant] = useState<NebulaVariant>(targetVariant);
  const [opacity, setOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Screen size check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth 300ms fade transition on variant changes (opacity 1 -> 0 -> 1)
  useEffect(() => {
    if (targetVariant === activeVariant) return;

    if (reducedMotion) {
      setActiveVariant(targetVariant);
      return;
    }

    if (transitionRef.current) clearTimeout(transitionRef.current);

    // Fade out (150ms)
    setOpacity(0);
    transitionRef.current = setTimeout(() => {
      setActiveVariant(targetVariant);
      // Fade in (150ms)
      setOpacity(1);
    }, 150);

    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [targetVariant, activeVariant, reducedMotion]);

  const params = useNebulaPalette(activeVariant, isMobile);

  const isDataVariant = activeVariant === "judge-data" || activeVariant === "mentor-data";
  const isMentor = activeVariant === "mentor-auth" || activeVariant === "mentor-data";
  const interactive = !isDataVariant;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ backgroundColor: "var(--bg, #03050A)" }}
    >
      {/* Halftone Nebula WebGL2 layer */}
      <div
        className="absolute inset-0 transition-opacity duration-150 ease-in-out"
        style={{ opacity: reducedMotion ? 1 : opacity }}
      >
        <HalftoneNebula
          height="100svh"
          eventTarget="window"
          interactive={interactive}
          touch="scroll"
          maxDpr={1.5}
          params={params}
        />
      </div>

      {/* Opposite-hue overlay (Step 4)
          Screen blend mode with soft radial of the OTHER color.
          - Green over pink-dominant (landing, judge-auth) positioned bottom-left (opposite to planet at upper-right)
          - Pink over green-dominant (mentor-auth) positioned left/center (opposite to planet at right)
          - Faint (6%) on data pages
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          mixBlendMode: "screen",
          opacity: isDataVariant ? 0.06 : 0.14,
          background: isMentor
            ? "radial-gradient(ellipse 65% 55% at 15% 50%, var(--nebula-hot, #FF5CB8) 0%, transparent 70%)"
            : "radial-gradient(ellipse 65% 55% at 15% 85%, var(--nebula-m-hot, #6DFF9A) 0%, transparent 70%)",
        }}
      />

      {/* Scrim Layers (Step 4) */}
      {/* 1. Landing Scrim: Dark radial behind hero headline */}
      {activeVariant === "landing" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 35% 45%, rgba(3, 5, 10, 0.65) 0%, transparent 75%)",
          }}
        />
      )}

      {/* 2. Login Scrim: Dark radial behind auth form card */}
      {(activeVariant === "judge-auth" || activeVariant === "mentor-auth") && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(3, 5, 10, 0.7) 0%, transparent 70%)",
          }}
        />
      )}

      {/* 3. Data Scrim: Extra flat 25% scrim over data-heavy views for WCAG readability */}
      {isDataVariant && (
        <div className="absolute inset-0 bg-[#03050A]/25 pointer-events-none" />
      )}
    </div>
  );
}
export default NebulaBackground;
