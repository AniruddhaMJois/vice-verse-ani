"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center font-mono select-none font-medium transition-colors border",
  {
    variants: {
      variant: {
        neutral: "bg-neutral-bg text-neutral border-neutral/35",
        warning: "bg-warning-bg text-warning border-warning/35",
        success: "bg-signal-bg text-signal border-signal/35",
        signal: "bg-signal-bg text-signal border-signal/35",
        accent: "bg-accent-bg text-accent border-accent/35",
        danger: "bg-danger-bg text-danger border-danger/35",
        info: "bg-info-bg text-info border-info/35",
        locked: "bg-locked-bg text-locked border-locked/35",
        tag: "bg-surface-3 text-text-muted border-border font-normal",
      },
      shape: {
        pill: "rounded-full px-2.5 py-0.5 text-[11px] tracking-wide",
        tag: "rounded-[4px] px-2 py-0.5 text-[11px] uppercase tracking-wider",
      },
    },
    defaultVariants: {
      variant: "neutral",
      shape: "pill",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  isLocked?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  shape = "pill",
  dot = false,
  isLocked = false,
  children,
  ...props
}: BadgeProps) {
  const dotColorClass = {
    neutral: "bg-neutral",
    warning: "bg-warning",
    success: "bg-signal",
    signal: "bg-signal",
    accent: "bg-accent",
    danger: "bg-danger",
    info: "bg-info",
    locked: "bg-locked",
    tag: "bg-text-muted",
  }[variant || "neutral"];

  return (
    <span className={cn(badgeVariants({ variant, shape, className }))} {...props}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0", dotColorClass)} />}
      {isLocked && <Lock className="w-3 h-3 mr-1 shrink-0 opacity-80" />}
      {children}
    </span>
  );
}
