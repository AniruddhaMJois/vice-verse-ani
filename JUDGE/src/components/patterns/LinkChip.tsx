"use client";

import React from "react";
import { ExternalLink, Presentation, Folder, Code, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface LinkChipProps {
  href?: string | null;
  label: string;
  domain?: string;
  variant?: "canva" | "drive" | "github" | "generic";
  icon?: React.ReactNode;
  className?: string;
}

export function LinkChip({
  href,
  label,
  domain,
  variant = "generic",
  icon,
  className,
}: LinkChipProps) {
  const getVariantIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case "canva":
        return <Presentation className="w-3.5 h-3.5 text-accent" />;
      case "drive":
        return <Folder className="w-3.5 h-3.5 text-signal" />;
      case "github":
        return <Code className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <LinkIcon className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  if (!href) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-border text-text-faint text-[11px] font-mono select-none opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span>{label}</span>
        <span className="text-text-faint text-[10px]">(Not provided)</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-border text-[11px] font-mono text-text transition-all duration-150 select-none hover:border-accent hover:text-white",
        className
      )}
    >
      {getVariantIcon()}
      <span className="font-medium">{label}</span>
      {domain && <span className="text-[10px] text-text-muted">({domain})</span>}
      <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-accent transition-transform ml-0.5" />
    </a>
  );
}
