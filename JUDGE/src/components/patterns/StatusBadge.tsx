"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Clock, CircleDot } from "lucide-react";
import { EvaluationStatus } from "@shared/types/database";
import { cn } from "@/lib/cn";

export interface StatusBadgeProps {
  status: EvaluationStatus | "in_progress" | "locked";
  isRealtimeUpdated?: boolean;
  className?: string;
}

export function StatusBadge({ status, isRealtimeUpdated = false, className }: StatusBadgeProps) {
  const [pulsing, setPulsing] = useState(isRealtimeUpdated);

  useEffect(() => {
    if (isRealtimeUpdated) {
      setPulsing(true);
      const timer = setTimeout(() => setPulsing(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [isRealtimeUpdated, status]);

  const config = {
    not_evaluated: {
      label: "Not Evaluated",
      classes: "bg-neutral-bg text-neutral border-neutral/35",
      dotClass: "bg-neutral",
      icon: <CircleDot className="w-3 h-3 text-neutral shrink-0" />,
    },
    draft: {
      label: "Saved as Draft",
      classes: "bg-warning-bg text-warning border-warning/35",
      dotClass: "bg-warning",
      icon: <Clock className="w-3 h-3 text-warning shrink-0" />,
    },
    submitted: {
      label: "Submitted",
      classes: "bg-signal-bg text-signal border-signal/35",
      dotClass: "bg-signal",
      icon: <Check className="w-3 h-3 text-signal shrink-0" />,
    },
    in_progress: {
      label: "In Progress",
      classes: "bg-info-bg text-info border-info/35",
      dotClass: "bg-info",
      icon: <CircleDot className="w-3 h-3 text-info shrink-0" />,
    },
    locked: {
      label: "Locked",
      classes: "bg-locked-bg text-locked border-locked/35",
      dotClass: "bg-locked",
      icon: <Lock className="w-3 h-3 text-locked shrink-0" />,
    },
  }[status] || {
    label: "Not Evaluated",
    classes: "bg-neutral-bg text-neutral border-neutral/35",
    dotClass: "bg-neutral",
    icon: <CircleDot className="w-3 h-3 text-neutral shrink-0" />,
  };

  return (
    <div
      aria-label={`Status: ${config.label}`}
      className={cn(
        "inline-flex items-center h-[26px] px-2.5 rounded-full border text-[11px] font-mono font-medium select-none transition-all duration-300 relative",
        config.classes,
        className
      )}
    >
      {/* 6px Status Dot with Realtime Pulse Ring */}
      <span className="relative flex items-center justify-center mr-1.5 shrink-0">
        {pulsing && (
          <motion.span
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn("absolute w-2 h-2 rounded-full", config.dotClass)}
          />
        )}
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      </span>

      <span>{config.label}</span>
    </div>
  );
}
