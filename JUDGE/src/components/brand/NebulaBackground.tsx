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
  const interactive = !isDataVariant;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "var(--bg, #03050A)",
      }}
    >
      {/* Halftone Nebula WebGL2 layer */}
      <div
        className="absolute inset-0 transition-opacity duration-150 ease-in-out"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          opacity: reducedMotion ? 1 : opacity,
        }}
      >
        <HalftoneNebula
          height="100%"
          eventTarget="window"
          interactive={interactive}
          touch="scroll"
          maxDpr={1.5}
          params={params}
        />
      </div>

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

      {/* 3. Data Scrim: Darker scrim over data-heavy views to prevent text camouflage */}
      {isDataVariant && (
        <div className="absolute inset-0 bg-[#03050A]/65 backdrop-blur-[2px] pointer-events-none" />
      )}
    </div>
  );
}
export default NebulaBackground;
