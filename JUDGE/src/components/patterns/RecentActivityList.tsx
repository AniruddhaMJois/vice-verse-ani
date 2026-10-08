"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ActivityItem } from "@/lib/data/types";
import { StatusBadge } from "@/components/patterns/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Activity, Radio, ChevronRight } from "lucide-react";

interface RecentActivityListProps {
  items: ActivityItem[];
  isLoading?: boolean;
  error?: string | null;
  portal?: "judge" | "mentor";
  onRetry?: () => void;
  className?: string;
}

export function RecentActivityList({
  items,
  isLoading = false,
  error = null,
  portal = "judge",
  onRetry,
  className = "",
}: RecentActivityListProps) {
  const isJudge = portal === "judge";

  if (isLoading) {
    return (
      <div className={`p-6 bg-surface/90 rounded-card border border-border space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-48 h-4 rounded" />
          </div>
          <Skeleton className="w-24 h-4 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-surface-2/60 rounded border border-border/50">
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-5 rounded" />
                <Skeleton className="w-20 h-5 rounded" />
                <Skeleton className="w-48 h-4 rounded" />
              </div>
              <Skeleton className="w-28 h-6 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-surface/90 rounded-card border border-danger/40 space-y-3 text-center ${className}`}>
        <p className="text-xs font-mono text-danger">Failed to load activity telemetry.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-mono text-signal underline hover:text-signal-lime"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 bg-surface/90 backdrop-blur-md rounded-card border border-border space-y-4 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-signal animate-pulse" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-white font-semibold flex items-center gap-2">
            <span>RECENT TELEMETRY &amp; ACTIVITY</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted px-2.5 py-0.5 rounded-full bg-surface-2 border border-border">
          <Radio className="w-3 h-3 text-signal animate-pulse" />
          <span>ALL {items.length} TEAMS ACTIVE</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-surface-2/40 rounded border border-border/40 font-mono text-xs text-text-muted">
          No team telemetry events logged yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((act) => {
            const detailHref = isJudge
              ? `/judge/teams/${act.teamId}`
              : `/mentor/teams/${act.teamId}`;

            return (
              <Link key={act.id} href={detailHref} className="block group select-none">
                <motion.div
                  whileHover={{ scale: 1.008, x: 3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface-2/70 hover:bg-surface-3 rounded-[6px] border border-border/70 hover:border-accent/60 transition-colors text-xs font-mono overflow-hidden ${
                    isJudge
                      ? "hover:shadow-[0_0_16px_rgba(255,46,154,0.18)]"
                      : "hover:shadow-[0_0_16px_rgba(0,255,65,0.18)]"
                  }`}
                >
                  {/* Left edge subtle indicator */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: isJudge
                        ? "linear-gradient(180deg, #FF2E9A 0%, #7B3FF2 100%)"
                        : "linear-gradient(180deg, #00FF41 0%, #22D3EE 100%)",
                    }}
                  />

                  {/* Left: Timestamp + Team Code (single line) + Team Name */}
                  <div className="flex items-center gap-3.5 flex-wrap min-w-0">
                    {/* Timestamp */}
                    <span className="text-text-faint text-[11px] tabular-nums shrink-0 min-w-[54px]">
                      {act.timestamp}
                    </span>

                    {/* Team ID Chip strictly on a single horizontal row */}
                    <span className="inline-flex items-center justify-center whitespace-nowrap shrink-0 px-3 py-1 rounded bg-surface-2 border-2 border-accent text-accent-hot font-bold text-xs tracking-wider shadow-sm">
                      {act.teamCode}
                    </span>

                    {/* Team Name */}
                    <span className="text-white font-sans font-medium text-xs truncate group-hover:text-accent transition-colors">
                      {act.teamName}
                    </span>
                  </div>

                  {/* Right: Action info + Status badge + Arrow */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-text-muted font-sans hidden md:inline">
                      {act.action}
                    </span>
                    <StatusBadge status={act.status} />
                    <ChevronRight className="w-4 h-4 text-text-faint group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
