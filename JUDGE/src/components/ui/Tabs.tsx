"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isLocked?: boolean;
  lockedTooltip?: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-2 border-b border-border w-full overflow-x-auto select-none", className)}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={tab.isLocked}
            onClick={() => {
              if (!tab.isLocked) {
                onChange(tab.id);
              }
            }}
            title={tab.isLocked ? tab.lockedTooltip || "Locked" : undefined}
            className={cn(
              "relative flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-t-[4px] shrink-0",
              tab.isLocked
                ? "opacity-50 cursor-not-allowed text-text-muted hover:text-text-muted"
                : isActive
                ? "text-white"
                : "text-text-muted hover:text-text"
            )}
          >
            {tab.isLocked ? (
              <Lock className="w-3.5 h-3.5 text-locked shrink-0" />
            ) : (
              tab.icon && <span className="shrink-0 text-current">{tab.icon}</span>
            )}
            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[3px] bg-surface-3 border border-border text-text-muted">
                {tab.badge}
              </span>
            )}

            {/* Sliding Dual-Accent Gradient Underline */}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] shadow-[0_0_8px_rgba(255,46,154,0.35)]"
                style={{
                  background: "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 32%, #22D3EE 66%, #00FF41 100%)",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
