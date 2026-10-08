"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "@/components/ui/Dialog";

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
   * Optional custom click handler for the Back button.
   */
  onBackClick?: () => void;
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
  onBackClick,
  children,
  className,
}: NavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onBackClick) {
      onBackClick();
      return;
    }

    // If currently on dashboard, ask for logout confirmation
    const isDashboard = pathname === "/judge/dashboard" || pathname === "/mentor/dashboard";
    if (isDashboard) {
      setShowLogoutConfirm(true);
      return;
    }

    if (backHref) {
      router.push(backHref);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(homeHref);
    }
  };

  const performLogout = () => {
    setShowLogoutConfirm(false);
    const role = user?.role;
    logout();
    if (role === "judge") {
      router.push("/judge/login");
    } else if (role === "mentor") {
      router.push("/mentor/login");
    } else {
      router.push("/");
    }
  };

  return (
    <>
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
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border hover:border-white/40 text-text-muted hover:text-white transition-all shadow-sm group active:scale-95 cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-accent-hot" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">{backLabel}</span>
            </button>
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

      {/* Logout Confirmation Dialog for Back Button on Dashboard */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={performLogout}
        title="Sign Out Confirmation"
        consequence="You are on the main dashboard. Going back from here will log you out of your jury/mentor session. Are you sure you want to sign out?"
        confirmLabel="Confirm Sign Out"
        cancelLabel="Stay on Dashboard"
        variant="destructive"
      />
    </>
  );
}

export default NavigationBar;
