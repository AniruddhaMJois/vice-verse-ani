"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  caption?: string; // One-line muted caption below e.g. "of 12 teams evaluated"
  delta?: { value: string; isPositive: boolean };
  statusChip?: string; // e.g. "LIVE", "ACTIVE", "+3 today"
  accentVariant?: "pink" | "green" | "dual";
  isLivePulsing?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  caption,
  delta,
  statusChip,
  accentVariant = "pink",
  isLivePulsing = false,
  icon,
  onClick,
  className,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === "number" ? 0 : value
  );

  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const duration = 650;
      const steps = 30;
      const stepTime = duration / steps;
      const increment = value / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const numberGradientClass =
    accentVariant === "green"
      ? "bg-clip-text text-transparent bg-gradient-to-r from-signal-lime via-signal to-signal-dim"
      : accentVariant === "dual"
      ? "bg-clip-text text-transparent bg-gradient-to-r from-accent via-accent-2 to-signal"
      : "bg-clip-text text-transparent bg-gradient-to-r from-accent-3 via-accent to-accent-hot";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "p-5 bg-surface border border-border rounded-card transition-all duration-200 select-none text-left flex flex-col justify-between group h-full",
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-glow-dual active:translate-y-0"
          : "hover:border-border-strong",
        className
      )}
    >
      {/* Top row: 40x40 Icon tile + Live pulse / Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {icon ? (
          <div className="w-10 h-10 rounded-[6px] bg-surface-2 flex items-center justify-center text-text-muted group-hover:text-white border border-border group-hover:border-accent/50 transition-colors shrink-0 shadow-sm">
            {icon}
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-[1px] bg-signal inline-block shrink-0 shadow-[0_0_4px_var(--signal)] mt-1.5" />
        )}

        {isLivePulsing ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-signal-bg border border-signal/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal shadow-[0_0_6px_var(--signal)]" />
            </span>
            <span className="font-mono text-[10px] font-bold text-signal uppercase tracking-wider">
              {statusChip || "ACTIVE"}
            </span>
          </div>
        ) : statusChip ? (
          <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-surface-2 text-text-muted border border-border uppercase tracking-wider">
            {statusChip}
          </span>
        ) : delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-[4px]",
              delta.isPositive
                ? "bg-signal-bg text-signal border border-signal/30"
                : "bg-danger-bg text-danger border border-danger/30"
            )}
          >
            {delta.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{delta.value}</span>
          </span>
        ) : null}
      </div>

      {/* Middle: Micro-label caption */}
      <div className="space-y-1 my-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-signal shrink-0 shadow-[0_0_4px_var(--signal)]" />
          <span className="font-mono text-xs uppercase tracking-wider text-text-muted font-medium">
            {label}
          </span>
        </div>

        {/* Large Tabular-nums Number */}
        <div className="flex items-baseline gap-1.5 font-mono pt-1">
          <span className={cn("text-4xl sm:text-5xl font-bold tabular-nums tracking-tight", numberGradientClass)}>
            {displayValue}
          </span>
          {suffix && <span className="text-base font-medium text-text-muted">{suffix}</span>}
        </div>
      </div>

      {/* Bottom: One-line muted caption */}
      {caption && (
        <p className="text-xs text-text-muted font-sans mt-3 line-clamp-1 border-t border-border/40 pt-2.5">
          {caption}
        </p>
      )}
    </div>
  );
}
