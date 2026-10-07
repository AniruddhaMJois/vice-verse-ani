"use client";

import { useEffect, useMemo, useState } from "react";
import type { NebulaParams } from "@/components/ui/halftone-nebula";

export type NebulaVariant =
  | "landing"
  | "judge-auth"
  | "mentor-auth"
  | "judge-data"
  | "mentor-data";

/**
 * Normalizes any CSS color string (#rgb, #rrggbb, #rrggbbaa, rgb(), rgba()) to #rrggbb.
 * Returns #000000 if invalid.
 */
export function toHex(color: string): string {
  if (!color) return "#000000";
  const c = color.trim();

  // Hex formats
  if (c.startsWith("#")) {
    if (c.length === 4) {
      // #rgb -> #rrggbb
      return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
    }
    if (c.length === 7) return c;
    if (c.length === 9) return c.slice(0, 7);
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[1]))));
    const g = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[2]))));
    const b = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[3]))));
    const toHexPart = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`;
  }

  return /^[0-9a-fA-F]{6}$/.test(c) ? `#${c}` : "#000000";
}

// Token fallback constants matching Step 1
const DEFAULT_SHARED_TOKENS = {
  voidColor: "#03050A",
  hazeColor: "#0A1A2E",
  duskColor: "#2A1450",
  wineColor: "#6B0F45",
  crimsonColor: "#E0207F",
  hotColor: "#FF5CB8",
  starColor: "#D9FFE4",
};

const DEFAULT_MENTOR_TOKENS = {
  voidColor: "#02060A",
  hazeColor: "#0A2430",
  duskColor: "#0C3A33",
  wineColor: "#0E5A3A",
  crimsonColor: "#12B85A",
  hotColor: "#6DFF9A",
  starColor: "#FFD6EC",
};

export function useNebulaPalette(variant: NebulaVariant = "landing", isMobile = false) {
  const [tokens, setTokens] = useState({
    shared: DEFAULT_SHARED_TOKENS,
    mentor: DEFAULT_MENTOR_TOKENS,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const style = getComputedStyle(document.documentElement);
    const getVal = (name: string, fallback: string) => {
      const val = style.getPropertyValue(name).trim();
      return val ? toHex(val) : fallback;
    };

    setTokens({
      shared: {
        voidColor: getVal("--nebula-void", DEFAULT_SHARED_TOKENS.voidColor),
        hazeColor: getVal("--nebula-haze", DEFAULT_SHARED_TOKENS.hazeColor),
        duskColor: getVal("--nebula-dusk", DEFAULT_SHARED_TOKENS.duskColor),
        wineColor: getVal("--nebula-wine", DEFAULT_SHARED_TOKENS.wineColor),
        crimsonColor: getVal("--nebula-crimson", DEFAULT_SHARED_TOKENS.crimsonColor),
        hotColor: getVal("--nebula-hot", DEFAULT_SHARED_TOKENS.hotColor),
        starColor: getVal("--nebula-star", DEFAULT_SHARED_TOKENS.starColor),
      },
      mentor: {
        voidColor: getVal("--nebula-m-void", DEFAULT_MENTOR_TOKENS.voidColor),
        hazeColor: getVal("--nebula-m-haze", DEFAULT_MENTOR_TOKENS.hazeColor),
        duskColor: getVal("--nebula-m-dusk", DEFAULT_MENTOR_TOKENS.duskColor),
        wineColor: getVal("--nebula-m-wine", DEFAULT_MENTOR_TOKENS.wineColor),
        crimsonColor: getVal("--nebula-m-crimson", DEFAULT_MENTOR_TOKENS.crimsonColor),
        hotColor: getVal("--nebula-m-hot", DEFAULT_MENTOR_TOKENS.hotColor),
        starColor: getVal("--nebula-m-star", DEFAULT_MENTOR_TOKENS.starColor),
      },
    });
  }, []);

  return useMemo<Partial<NebulaParams>>(() => {
    const isMentor = variant === "mentor-auth" || variant === "mentor-data";
    const palette = isMentor ? tokens.mentor : tokens.shared;

    const baseConfig: Partial<NebulaParams> = {
      voidColor: palette.voidColor,
      hazeColor: palette.hazeColor,
      duskColor: palette.duskColor,
      wineColor: palette.wineColor,
      crimsonColor: palette.crimsonColor,
      hotColor: palette.hotColor,
      starColor: palette.starColor,
      pixel: isMobile ? 8 : 6,
    };

    switch (variant) {
      case "landing":
        return {
          ...baseConfig,
          seed: 11,
          planet: true,
          planetX: 0.76,
          planetY: 0.22,
          sparkles: isMobile ? 4 : 9,
          density: 0.5,
          threshold: 0.54,
          band: 0.5,
          bandAngle: 1.05,
          bandOffset: 0.42,
          haze: 0.8,
          vignette: 0.5,
          dotMax: 0.56,
        };

      case "judge-auth":
        return {
          ...baseConfig,
          seed: 11,
          planet: true,
          planetX: 0.74,
          planetY: 0.2,
          sparkles: isMobile ? 4 : 8,
          density: 0.5,
          threshold: 0.54,
          band: 0.5,
          bandAngle: 1.05,
          bandOffset: 0.42,
          haze: 0.8,
          vignette: 0.5,
          dotMax: 0.56,
        };

      case "mentor-auth":
        return {
          ...baseConfig,
          seed: 4,
          planet: true,
          planetX: 0.8,
          planetY: 0.5,
          bandAngle: -0.4,
          band: 0.5,
          bandOffset: -0.2,
          sparkles: isMobile ? 4 : 8,
          density: 0.5,
          threshold: 0.54,
          haze: 0.8,
          vignette: 0.5,
          dotMax: 0.56,
        };

      case "judge-data":
        return {
          ...baseConfig,
          seed: 11,
          planet: false,
          sparkles: isMobile ? 2 : 3,
          density: 0.35,
          threshold: 0.6,
          dotMax: 0.46,
          band: 0.35,
          vignette: 0.62,
          bandAngle: 1.05,
          bandOffset: 0.42,
          haze: 0.5,
        };

      case "mentor-data":
        return {
          ...baseConfig,
          seed: 4,
          planet: false,
          sparkles: isMobile ? 2 : 3,
          density: 0.35,
          threshold: 0.6,
          dotMax: 0.46,
          band: 0.35,
          vignette: 0.62,
          bandAngle: -0.4,
          bandOffset: -0.2,
          haze: 0.5,
        };
    }
  }, [variant, tokens, isMobile]);
}
