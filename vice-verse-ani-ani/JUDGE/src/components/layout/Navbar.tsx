"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import {
  LogOut,
  ShieldCheck,
  Eye,
  Menu,
  X,
  Layers,
  Users,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isJudge, isMentor, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSupabase = process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const currentRole = user?.role;
    logout();
    if (currentRole === "judge") {
      router.push("/judge/login");
    } else if (currentRole === "mentor") {
      router.push("/mentor/login");
    } else {
      router.push("/");
    }
  };

  const navLinks = user
    ? isJudge
      ? [
          { label: "Dashboard", href: "/judge/dashboard", icon: <Layers className="w-4 h-4" /> },
          { label: "Teams Roster", href: "/judge/teams", icon: <Users className="w-4 h-4" /> },
        ]
      : [
          { label: "Dashboard", href: "/mentor/dashboard", icon: <Layers className="w-4 h-4" /> },
          { label: "Teams Overview", href: "/mentor/teams", icon: <Users className="w-4 h-4" /> },
        ]
    : [];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-[#03050A]/85 backdrop-blur-xl border-b border-border shadow-card"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo Mark + Wordmark */}
        <div className="flex items-center gap-6">
          <Logo size="md" showSubtitle={true} isLink={true} />

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border/50">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 rounded ${
                      isActive ? "text-white font-bold" : "text-text-muted hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full shadow-[0_0_8px_rgba(255,46,154,0.35)]"
                        style={{
                          background: isJudge
                            ? "linear-gradient(90deg, #FF2E9A 0%, #7B3FF2 100%)"
                            : "linear-gradient(90deg, #00FF41 0%, #22D3EE 100%)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right: Actions, System Beacon, User Block */}
        <div className="flex items-center gap-3">
          {/* Live System Beacon */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-2 border border-border text-[11px] font-mono text-text-muted">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal shadow-[0_0_8px_var(--signal)]" />
            </span>
            <span className="text-signal font-medium">LIVE</span>
            <span className="text-border-strong">|</span>
            <span className="text-text-faint">{isSupabase ? "Supabase Node" : "Mock Telemetry"}</span>
          </div>

          {/* User Badge */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    isJudge
                      ? "bg-accent/15 text-accent border-accent/40"
                      : "bg-signal/15 text-signal border-signal/40"
                  }`}
                >
                  {user.role}
                </span>
                <span className="text-xs font-mono font-semibold text-white">
                  {user.loginId}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="font-mono text-xs text-text-muted hover:text-danger"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/judge/login">
                <Button variant="ghost" size="sm" className="font-mono text-xs">
                  Judge Portal
                </Button>
              </Link>
              <Link href="/mentor/login">
                <Button variant="secondary-green" size="sm" className="font-mono text-xs">
                  Mentor Portal
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-surface-2 border border-border text-text-muted hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-2 border-b border-border p-4 space-y-3">
          {user ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="font-mono text-xs">
                  <span className="text-text-muted">LOGGED AS: </span>
                  <span className="text-white font-bold">{user.loginId}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    isJudge
                      ? "bg-accent/15 text-accent border-accent/40"
                      : "bg-signal/15 text-signal border-signal/40"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded text-xs font-mono text-text-muted hover:text-white hover:bg-surface-3"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full font-mono text-xs text-danger justify-center"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Link href="/judge/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="primary" size="sm" className="w-full font-mono text-xs justify-center">
                  Judge Portal Login
                </Button>
              </Link>
              <Link href="/mentor/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="secondary-green" size="sm" className="w-full font-mono text-xs justify-center">
                  Mentor Portal Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
