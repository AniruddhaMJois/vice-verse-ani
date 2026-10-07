"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  isLink?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showSubtitle = true,
  isLink = true,
  className,
}: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-8 h-8";
  const titleSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Icon Mark: 28-32px rounded-square outline with dual gradient border on hover */}
      <div
        className={cn(
          iconSize,
          "rounded-[6px] border border-border-strong bg-surface-2 p-[1px] relative flex items-center justify-center shrink-0 transition-all duration-200 group-hover:border-accent group-hover:shadow-glow-pink"
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          <defs>
            <linearGradient id="logo-pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A3D" />
              <stop offset="45%" stopColor="#FF2E9A" />
              <stop offset="100%" stopColor="#7B3FF2" />
            </linearGradient>
            <linearGradient id="logo-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="60%" stopColor="#00FF41" />
              <stop offset="100%" stopColor="#B8FF3C" />
            </linearGradient>
          </defs>
          {/* Stylized Double V Monogram (Pink to Green) */}
          <path
            d="M4 8L12 24L16 16"
            stroke="url(#logo-pink-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 16L20 24L28 8"
            stroke="url(#logo-green-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark: "Brand" in white weight 500 + second word in text-muted weight 300 */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-medium tracking-tight text-white", titleSize)}>
            VICE<span className="font-light text-text-muted">VERSE</span>
          </span>
          {/* '26 chip: pink tint */}
          <span className="font-mono text-[10px] uppercase font-semibold px-1 py-0.5 rounded-[2px] bg-accent/15 text-accent-hot border border-accent/30">
            &apos;26
          </span>
        </div>
        {showSubtitle && (
          <span className="font-script text-accent script-chromatic text-xs -mt-0.5 -rotate-2">
            Judge &amp; Mentor
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
