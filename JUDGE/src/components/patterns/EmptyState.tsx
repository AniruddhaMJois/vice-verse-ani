"use client";

import React from "react";
import { SkylineSVG } from "@/components/brand/SkylineSVG";
import { ScriptText } from "@/components/brand/ScriptText";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  scriptAccent?: string;
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  scriptAccent = "Nothing here yet",
  title = "No Records Found",
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative w-full p-8 sm:p-12 bg-surface border border-border rounded-card text-center overflow-hidden flex flex-col items-center justify-center min-h-[320px] select-none",
        className
      )}
    >
      {/* Background Skyline Silhouette */}
      <SkylineSVG opacity={0.2} />

      <div className="relative z-10 max-w-md space-y-3">
        <ScriptText variant="pink" size="md">
          {scriptAccent}
        </ScriptText>

        <h3 className="text-lg font-medium text-white tracking-tight">{title}</h3>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>

        {actionLabel && onAction && (
          <div className="pt-3">
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "System Anomaly Encountered",
  message,
  errorCode = "ERR_CONSENSUS_SYNC",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "w-full p-8 bg-surface border border-danger/40 rounded-card text-center flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-danger-bg border border-danger/30 flex items-center justify-center text-danger font-mono text-sm font-bold">
        !
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-xs text-text-muted max-w-md leading-relaxed">{message}</p>
      <div className="font-mono text-[11px] text-text-faint px-2 py-1 rounded bg-surface-2 border border-border">
        Code: {errorCode}
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
