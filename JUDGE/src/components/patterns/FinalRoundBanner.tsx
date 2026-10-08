"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Trophy } from "lucide-react";

interface FinalRoundBannerProps {
  completedCount: number;
  totalCount: number;
  teamsRoute: string; // e.g. "/judge/teams" or "/mentor/teams"
  isJudge?: boolean;
}

export function FinalRoundBanner({
  completedCount,
  totalCount,
  teamsRoute,
  isJudge = true,
}: FinalRoundBannerProps) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className="relative p-6 sm:p-7 bg-surface/90 backdrop-blur-md rounded-card border border-border overflow-hidden transition-all duration-200 hover:border-border-strong shadow-lg"
      style={{
        borderTop: "2px solid transparent",
        borderImage: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 50%, #00FF41 100%) 1",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[6px] bg-surface-2 border border-border flex items-center justify-center text-accent">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Final Round</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-signal-bg border border-signal/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-signal shadow-[0_0_6px_var(--signal)]" />
                </span>
                <span className="font-mono text-[10px] font-bold text-signal uppercase tracking-wider">
                  ACTIVE
                </span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-text-muted max-w-xl">
            {isJudge
              ? "Allotted team dossiers and standardized 100-marks scoring matrix are live for evaluation."
              : "Live observational feed across all jury panels and finalist candidate teams."}
          </p>

          {/* Evaluations Progress in Green Mono */}
          <div className="flex items-center gap-4 pt-1 font-mono text-xs">
            <span className="text-text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-[1px] bg-signal inline-block" />
              EVALUATIONS:
            </span>
            <span className="text-signal font-bold tracking-wider">
              {completedCount} / {totalCount} ({percent}%)
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center shrink-0">
          <Link href={teamsRoute}>
            <Button
              variant={isJudge ? "primary" : "secondary-green"}
              size="lg"
              className="font-mono text-xs tracking-wider px-6 shadow-glow-dual"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Team Roster
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
