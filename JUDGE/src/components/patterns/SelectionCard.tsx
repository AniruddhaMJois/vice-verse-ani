"use client";

import React from "react";
import { ArrowRight, Lock, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectionCardProps {
  index: string | number;
  title: string;
  description: string;
  completedCount?: number;
  totalCount?: number;
  status?: "active" | "locked" | "completed";
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SelectionCard({
  index,
  title,
  description,
  completedCount = 0,
  totalCount = 1,
  status = "active",
  isSelected = false,
  onClick,
  className,
}: SelectionCardProps) {
  const isLocked = status === "locked";
  const progressPercent = Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100));
  const formattedIndex = typeof index === "number" ? String(index).padStart(2, "0") : index;

  return (
    <div
      onClick={() => {
        if (!isLocked) onClick?.();
      }}
      tabIndex={isLocked ? -1 : 0}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      title={isLocked ? "This round is currently locked" : undefined}
      className={cn(
        "group relative p-6 bg-surface border rounded-card transition-all duration-200 select-none text-left flex flex-col justify-between h-[210px]",
        isLocked
          ? "opacity-40 cursor-not-allowed border-border"
          : isSelected
          ? "border-accent bg-surface-3 shadow-glow-pink cursor-pointer"
          : "border-border hover:border-border-strong hover:shadow-glow-dual hover:-translate-y-0.5 cursor-pointer",
        className
      )}
    >
      {/* Top Row: Large Mono Index + Status Badge */}
      <div className="flex items-start justify-between">
        <span className="font-mono text-3xl font-light text-text-faint group-hover:text-text-muted transition-colors">
          {formattedIndex}
        </span>

        {status === "completed" ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-signal-bg text-signal border border-signal/35">
            <Check className="w-3 h-3" />
            <span>Completed</span>
          </span>
        ) : status === "locked" ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-locked-bg text-locked border border-locked/35">
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-signal-bg text-signal border border-signal/35">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse shadow-[0_0_6px_var(--signal)]" />
            <span>Active</span>
          </span>
        )}
      </div>

      {/* Middle: Title & Meta */}
      <div className="space-y-1 my-2">
        <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-accent-hot transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{description}</p>
      </div>

      {/* Bottom: Progress Bar + Slide Arrow */}
      <div className="pt-3 border-t border-border-faint space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-muted">
            Evaluations: <strong className="text-white">{completedCount}</strong> / {totalCount}
          </span>
          <span className={progressPercent === 100 ? "text-signal font-semibold" : "text-accent font-semibold"}>
            {progressPercent}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
              }}
            />
          </div>

          <ArrowRight
            className={cn(
              "w-4 h-4 text-text-muted transition-transform shrink-0",
              !isLocked && "group-hover:translate-x-1 group-hover:text-accent"
            )}
          />
        </div>
      </div>
    </div>
  );
}
