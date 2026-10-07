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
const DEFAULT_PINK_TOKENS = {
  voidColor: "#03050A",
  hazeColor: "#0A1A2E",
  duskColor: "#2A1450",
  wineColor: "#6B0F45",
  crimsonColor: "#E0207F",
  hotColor: "#FF5CB8",
  starColor: "#FFD6EC",
};

const DEFAULT_GREEN_TOKENS = {
  voidColor2: "#02060A",
  hazeColor2: "#0A2430",
  duskColor2: "#0C3A33",
  wineColor2: "#0E5A3A",
  crimsonColor2: "#12B85A",
  hotColor2: "#6DFF9A",
  starColor2: "#D9FFE4",
};

const DEFAULT_BRIDGE_TOKENS = {
  bridgeColorA: "#7B3FF2",
  bridgeColorB: "#22D3EE",
};

const DEFAULT_SEAM_TOKENS = {
  seam: 0.5,
  seamWidth: 0.22,
  seamWobble: 0.06,
};

export function useNebulaPalette(variant: NebulaVariant = "landing", isMobile = false) {
  const [tokens, setTokens] = useState({
    pink: DEFAULT_PINK_TOKENS,
    green: DEFAULT_GREEN_TOKENS,
    bridge: DEFAULT_BRIDGE_TOKENS,
    seam: DEFAULT_SEAM_TOKENS,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const style = getComputedStyle(document.documentElement);
    const getColor = (name: string, fallback: string) => {
      const val = style.getPropertyValue(name).trim();
      return val ? toHex(val) : fallback;
    };
    const getNum = (name: string, fallback: number) => {
      const val = style.getPropertyValue(name).trim();
      const n = parseFloat(val);
      return Number.isFinite(n) ? n : fallback;
    };

    setTokens({
      pink: {
        voidColor: getColor("--nebula-void", DEFAULT_PINK_TOKENS.voidColor),
        hazeColor: getColor("--nebula-haze", DEFAULT_PINK_TOKENS.hazeColor),
        duskColor: getColor("--nebula-dusk", DEFAULT_PINK_TOKENS.duskColor),
        wineColor: getColor("--nebula-wine", DEFAULT_PINK_TOKENS.wineColor),
        crimsonColor: getColor("--nebula-crimson", DEFAULT_PINK_TOKENS.crimsonColor),
        hotColor: getColor("--nebula-hot", DEFAULT_PINK_TOKENS.hotColor),
        starColor: getColor("--nebula-star", DEFAULT_PINK_TOKENS.starColor),
      },
      green: {
        voidColor2: getColor("--nebula-g-void", DEFAULT_GREEN_TOKENS.voidColor2),
        hazeColor2: getColor("--nebula-g-haze", DEFAULT_GREEN_TOKENS.hazeColor2),
        duskColor2: getColor("--nebula-g-dusk", DEFAULT_GREEN_TOKENS.duskColor2),
        wineColor2: getColor("--nebula-g-wine", DEFAULT_GREEN_TOKENS.wineColor2),
        crimsonColor2: getColor("--nebula-g-crimson", DEFAULT_GREEN_TOKENS.crimsonColor2),
        hotColor2: getColor("--nebula-g-hot", DEFAULT_GREEN_TOKENS.hotColor2),
        starColor2: getColor("--nebula-g-star", DEFAULT_GREEN_TOKENS.starColor2),
      },
      bridge: {
        bridgeColorA: getColor("--nebula-bridge-a", DEFAULT_BRIDGE_TOKENS.bridgeColorA),
        bridgeColorB: getColor("--nebula-bridge-b", DEFAULT_BRIDGE_TOKENS.bridgeColorB),
      },
      seam: {
        seam: getNum("--nebula-seam", DEFAULT_SEAM_TOKENS.seam),
        seamWidth: getNum("--nebula-seam-width", DEFAULT_SEAM_TOKENS.seamWidth),
        seamWobble: getNum("--nebula-seam-wobble", DEFAULT_SEAM_TOKENS.seamWobble),
      },
    });
  }, []);

  return useMemo<Partial<NebulaParams>>(() => {
    const baseConfig: Partial<NebulaParams> = {
      voidColor: tokens.pink.voidColor,
      hazeColor: tokens.pink.hazeColor,
      duskColor: tokens.pink.duskColor,
      wineColor: tokens.pink.wineColor,
      crimsonColor: tokens.pink.crimsonColor,
      hotColor: tokens.pink.hotColor,
      starColor: tokens.pink.starColor,

      voidColor2: tokens.green.voidColor2,
      hazeColor2: tokens.green.hazeColor2,
      duskColor2: tokens.green.duskColor2,
      wineColor2: tokens.green.wineColor2,
      crimsonColor2: tokens.green.crimsonColor2,
      hotColor2: tokens.green.hotColor2,
      starColor2: tokens.green.starColor2,

      bridgeColorA: tokens.bridge.bridgeColorA,
      bridgeColorB: tokens.bridge.bridgeColorB,

      seamWidth: tokens.seam.seamWidth,
      seamWobble: tokens.seam.seamWobble,
      splitStars: true,
      pixel: isMobile ? 8 : 6,
    };

    switch (variant) {
      case "landing":
        return {
          ...baseConfig,
          seam: 0.50,
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
          seam: 0.62,
          seed: 11,
          planet: true,
          planetX: 0.24,
          planetY: 0.22,
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
          seam: 0.38,
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
          seam: 0.62,
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
          seam: 0.38,
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
