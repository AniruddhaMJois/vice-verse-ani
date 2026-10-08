"use client";

import React from "react";
import { ChevronRight, Users } from "lucide-react";
import { Team, EvaluationStatus } from "@shared/types/database";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/cn";

export interface ListRowProps {
  team: Team;
  status: EvaluationStatus;
  isSelected?: boolean;
  isRealtimeFlash?: boolean;
  onClick?: () => void;
  viewMode?: "list" | "grid" | "compact";
  className?: string;
}

export function ListRow({
  team,
  status,
  isSelected = false,
  isRealtimeFlash = false,
  onClick,
  viewMode = "list",
  className,
}: ListRowProps) {
  if (viewMode === "grid") {
    return (
      <div
        onClick={onClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cn(
          "group relative p-5 bg-surface border rounded-card transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between h-[190px]",
          "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-glow-dual",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          isSelected ? "border-accent bg-surface-3 shadow-glow-pink" : "border-border",
          isRealtimeFlash && "animate-realtime-flash",
          className
        )}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-accent/15 text-accent border border-accent/30">
            {team.team_code}
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white group-hover:text-accent transition-colors truncate">
            {team.name}
          </h4>
          <p className="text-xs text-text-muted truncate">{team.case_study}</p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-border-faint text-[11px] text-text-faint font-mono">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-text-muted" />
            <span>{team.members?.length || 0} Members</span>
          </span>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  }

  if (viewMode === "compact") {
    return (
      <div
        onClick={onClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={cn(
          "group relative w-full h-12 px-4 bg-surface hover:bg-surface-2 border-b border-border transition-all duration-150 cursor-pointer select-none flex items-center justify-between gap-3 text-left",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
          isSelected && "bg-surface-3 border-l-2 border-l-accent",
          isRealtimeFlash && "animate-realtime-flash",
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs font-semibold text-accent shrink-0">
            {team.team_code}
          </span>
          <span className="text-xs font-medium text-white group-hover:text-accent transition-colors truncate">
            {team.name}
          </span>
          <span className="text-[11px] text-text-muted hidden sm:inline truncate">&bull; {team.case_study}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={status} />
          <ChevronRight className="w-4 h-4 text-text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    );
  }

  // Default: "Windows content view" / file-explorer style row
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative w-full min-h-[64px] px-4 sm:px-6 py-3.5 bg-surface hover:bg-surface-2 border-b border-border transition-all duration-150 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent",
        isSelected && "bg-surface-3",
        isRealtimeFlash && "animate-realtime-flash",
        className
      )}
    >
      {/* 2px Left Gradient Bar on Hover (Pink to Green) */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-150 pointer-events-none",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{
          background: "linear-gradient(to bottom, #FF2E9A 0%, #7B3FF2 50%, #00FF41 100%)",
        }}
      />

      {/* Left: Team ID Chip (Pink) + Name & Case Study */}
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-[4px] bg-accent/15 text-accent border border-accent/30 shrink-0 shadow-sm">
          {team.team_code}
        </span>

        <div className="min-w-0">
          <div className="text-sm font-medium text-white group-hover:text-accent-hot transition-colors truncate">
            {team.name}
          </div>
          <div className="text-xs text-text-muted truncate mt-0.5 flex items-center gap-2">
            <span>{team.case_study}</span>
            {team.members && team.members.length > 0 && (
              <>
                <span className="text-border-strong">&bull;</span>
                <span className="font-mono text-[11px] text-text-faint">{team.members.length} Members</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Status Badge & Chevron Action */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <StatusBadge status={status} />
        <div className="flex items-center gap-1 text-text-muted group-hover:text-white transition-colors">
          <span className="font-mono text-xs hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity">
            Inspect
          </span>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </div>
    </div>
  );
}
