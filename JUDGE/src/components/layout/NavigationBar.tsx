"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NavigationBarProps {
  /**
   * Optional custom fallback or destination for the Back button.
   * If omitted, router.back() is invoked (or history fallback).
   */
  backHref?: string;
  /**
   * Destination for the Home button. Defaults to "/" or role dashboard if specified.
   */
  homeHref?: string;
  /**
   * Label for Back button, defaults to "BACK"
   */
  backLabel?: string;
  /**
   * Label for Home button, defaults to "HOME"
   */
  homeLabel?: string;
  /**
   * Show home button (defaults to true)
   */
  showHome?: boolean;
  /**
   * Show back button (defaults to true)
   */
  showBack?: boolean;
  /**
   * Optional extra actions or breadcrumbs to display alongside
   */
  children?: React.ReactNode;
  className?: string;
}

export function NavigationBar({
  backHref,
  homeHref = "/",
  backLabel = "Back",
  homeLabel = "Home",
  showHome = true,
  showBack = true,
  children,
  className,
}: NavigationBarProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    if (backHref) {
      // Let standard Link handle navigation or router.push
      return;
    }
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(homeHref);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 font-mono text-xs select-none py-1",
        className
      )}
      aria-label="Page navigation"
    >
      <div className="flex items-center gap-2">
        {/* Back Button */}
        {showBack && (
          backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border hover:border-white/40 text-text-muted hover:text-white transition-all shadow-sm group active:scale-95"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-accent-hot" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">{backLabel}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border hover:border-white/40 text-text-muted hover:text-white transition-all shadow-sm group active:scale-95 cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-accent-hot" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">{backLabel}</span>
            </button>
          )
        )}

        {/* Home Button */}
        {showHome && (
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border hover:border-white/40 text-text-muted hover:text-white transition-all shadow-sm group active:scale-95"
            title="Go to Home"
          >
            <Home className="w-3.5 h-3.5 text-signal transition-transform group-hover:scale-110" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">{homeLabel}</span>
          </Link>
        )}
      </div>

      {/* Optional right-aligned children (like breadcrumb tail or extra controls) */}
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export default NavigationBar;
