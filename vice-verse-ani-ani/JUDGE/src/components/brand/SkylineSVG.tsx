"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface SkylineSVGProps {
  className?: string;
  opacity?: number;
}

export function SkylineSVG({ className, opacity = 0.4 }: SkylineSVGProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0",
        className
      )}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="skyline-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#141826" />
            <stop offset="100%" stopColor="#02040A" />
          </linearGradient>
          <linearGradient id="rim-light-dual" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF2E9A" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#7B3FF2" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Distant Skyscrapers */}
        <path
          d="M0 180 L0 120 L40 120 L40 90 L80 90 L80 130 L130 130 L130 70 L170 70 L170 140 L230 140 L230 60 L280 60 L280 120 L350 120 L350 80 L390 80 L390 140 L460 140 L460 50 L500 50 L500 130 L570 130 L570 95 L620 95 L620 150 L700 150 L700 40 L730 40 L740 20 L750 40 L780 40 L780 130 L860 130 L860 75 L910 75 L910 140 L980 140 L980 60 L1020 60 L1020 120 L1090 120 L1090 85 L1140 85 L1140 150 L1210 150 L1210 50 L1250 50 L1250 130 L1320 130 L1320 90 L1380 90 L1380 120 L1440 120 L1440 180 Z"
          fill="url(#skyline-fill)"
        />

        {/* Rim Light Stroke along top edges with Dual Pink x Matrix Green */}
        <path
          d="M0 120 L40 120 L40 90 L80 90 L80 130 L130 130 L130 70 L170 70 L170 140 L230 140 L230 60 L280 60 L280 120 L350 120 L350 80 L390 80 L390 140 L460 140 L460 50 L500 50 L500 130 L570 130 L570 95 L620 95 L620 150 L700 150 L700 40 L730 40 L740 20 L750 40 L780 40 L780 130 L860 130 L860 75 L910 75 L910 140 L980 140 L980 60 L1020 60 L1020 120 L1090 120 L1090 85 L1140 85 L1140 150 L1210 150 L1210 50 L1250 50 L1250 130 L1320 130 L1320 90 L1380 90 L1380 120 L1440 120"
          stroke="url(#rim-light-dual)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Left Palm Trees Silhouette */}
        <g fill="#141826" stroke="url(#rim-light-dual)" strokeWidth="0.75">
          {/* Palm Trunk 1 */}
          <path d="M120 180 Q130 120 145 70 Q147 68 143 68 Q128 120 115 180 Z" />
          {/* Fronds */}
          <path d="M145 70 Q120 50 80 65 Q110 60 145 70" />
          <path d="M145 70 Q135 35 110 35 Q135 45 145 70" />
          <path d="M145 70 Q155 30 180 35 Q160 48 145 70" />
          <path d="M145 70 Q175 45 205 60 Q170 65 145 70" />
          <path d="M145 70 Q180 75 210 95 Q175 85 145 70" />
          <path d="M145 70 Q115 75 85 95 Q120 85 145 70" />

          {/* Palm Trunk 2 */}
          <path d="M1320 180 Q1310 125 1295 75 Q1293 73 1297 73 Q1312 125 1325 180 Z" />
          <path d="M1295 75 Q1320 55 1360 70 Q1330 65 1295 75" />
          <path d="M1295 75 Q1305 40 1330 40 Q1305 50 1295 75" />
          <path d="M1295 75 Q1285 35 1260 40 Q1280 53 1295 75" />
          <path d="M1295 75 Q1265 50 1235 65 Q1270 70 1295 75" />
          <path d="M1295 75 Q1260 80 1230 100 Q1265 90 1295 75" />
        </g>
      </svg>
    </div>
  );
}
