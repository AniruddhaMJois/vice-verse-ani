"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface ScriptTextProps {
  children: React.ReactNode;
  variant?: "pink" | "sunset" | "green";
  size?: "sm" | "md" | "lg" | "xl";
  rotate?: boolean;
  className?: string;
}

export function ScriptText({
  children,
  variant = "pink",
  size = "md",
  rotate = true,
  className,
}: ScriptTextProps) {
  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl",
  }[size];

  const variantStyle =
    variant === "pink"
      ? "text-accent script-chromatic drop-shadow-[0_0_12px_rgba(255,46,154,0.35)]"
      : variant === "green"
      ? "text-signal drop-shadow-[0_0_12px_rgba(0,255,65,0.35)]"
      : "bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent-2 to-signal";

  return (
    <span
      className={cn(
        "font-script font-normal inline-block select-none tracking-normal",
        sizeClasses,
        variantStyle,
        rotate && "-rotate-2",
        className
      )}
    >
      {children}
    </span>
  );
}
