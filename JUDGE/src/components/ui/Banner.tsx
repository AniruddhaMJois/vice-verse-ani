"use client";

import React from "react";
import { Lock, Info, AlertTriangle, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BannerProps {
  variant?: "info" | "locked" | "warning" | "error" | "success";
  title?: string;
  description: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Banner({
  variant = "info",
  title,
  description,
  onDismiss,
  className,
}: BannerProps) {
  const config = {
    info: {
      border: "border-info/30 border-dashed bg-info-bg/30 text-info",
      icon: <Info className="w-4 h-4 text-info shrink-0" />,
    },
    locked: {
      border: "border-locked/40 border-dashed bg-locked-bg/40 text-text-muted",
      icon: <Lock className="w-4 h-4 text-text-faint shrink-0" />,
    },
    warning: {
      border: "border-warning/40 bg-warning-bg/30 text-warning",
      icon: <AlertTriangle className="w-4 h-4 text-warning shrink-0" />,
    },
    error: {
      border: "border-danger/40 bg-danger-bg/30 text-danger",
      icon: <AlertCircle className="w-4 h-4 text-danger shrink-0" />,
    },
    success: {
      border: "border-signal/40 bg-signal-bg/30 text-signal",
      icon: <CheckCircle className="w-4 h-4 text-signal shrink-0" />,
    },
  }[variant];

  return (
    <div
      className={cn(
        "w-full rounded-[12px] p-3.5 sm:p-4 border flex items-start gap-3 text-xs leading-relaxed select-none",
        config.border,
        className
      )}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1">
        {title && <div className="font-semibold text-text mb-0.5">{title}</div>}
        <div className="text-text-muted">{description}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-[4px] text-text-muted hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function LockedBanner({
  title = "View-Only Access",
  description = "Scoring and marks allocation is restricted to authorized jury judges only.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <Banner
      variant="locked"
      title={title}
      description={description}
      className={className}
    />
  );
}
