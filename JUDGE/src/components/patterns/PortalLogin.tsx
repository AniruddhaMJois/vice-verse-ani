"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/data/types";
import { WireframeGlobe } from "@/components/brand/WireframeGlobe";
import { BootLoader } from "@/components/brand/BootLoader";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Eye, AlertCircle, ArrowRight, Lock } from "lucide-react";

interface PortalLoginProps {
  role: UserRole; // "judge" | "mentor"
}

export function PortalLogin({ role }: PortalLoginProps) {
  const router = useRouter();
  const { login } = useAuth();

  const isJudge = role === "judge";
  const expectedPrefix = isJudge ? "JDG" : "MNR";

  const [loginId, setLoginId] = useState("");
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const pinRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const cleanId = loginId.trim().toUpperCase().replace(/\s+/g, "");
  const isIdValid = /^[A-Z]{3}[0-9]{5}$/.test(cleanId) && cleanId.startsWith(expectedPrefix);
  const pin = pinDigits.join("");
  const isPinValid = pin.length === 4 && /^[0-9]{4}$/.test(pin);
  const isFormValid = isIdValid && isPinValid && cooldown === 0;

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    setLoginId(val);
  };

  const handlePinChange = (index: number, val: string) => {
    setError(null);
    const cleaned = val.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const newDigits = [...pinDigits];
      newDigits[index] = "";
      setPinDigits(newDigits);
      return;
    }

    const digit = cleaned.slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = digit;
    setPinDigits(newDigits);

    // Auto advance
    if (index < 3 && digit) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setPinDigits(pasted.split(""));
      pinRefs[3].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || cooldown > 0) return;

    setIsSubmitting(true);
    setError(null);

    const res = await login(cleanId, pin, role);

    if (res.success) {
      setIsBooting(true);
      setTimeout(() => {
        router.push(isJudge ? "/judge/dashboard" : "/mentor/dashboard");
      }, 1400);
    } else {
      setIsSubmitting(false);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setCooldown(30);
      }
      setShake(true);
      setError("Invalid ID or PIN");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-text flex items-center justify-center p-4 sm:p-6 overflow-hidden">

      {/* Bootloader Transition Screen */}
      {isBooting && (
        <BootLoader
          portalName={isJudge ? "JUDGE PORTAL" : "MENTOR PORTAL"}
          onComplete={() => {}}
        />
      )}

      {/* Main Split Container: Globe + Login Form Card */}
      <div className="relative z-10 w-full max-w-[1020px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Interactive Wireframe Globe */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 lg:order-1 text-center py-4">
          <WireframeGlobe
            accentColor={isJudge ? "#FF2E9A" : "#00FF41"}
            signalColor={isJudge ? "#00FF41" : "#22D3EE"}
            size={420}
          />
          <div className="mt-4 space-y-1">
            <h2 className="text-lg font-mono font-medium text-white tracking-wider">
              {isJudge ? "JURY CONSENSUS NODE" : "OBSERVATIONAL TELEMETRY"}
            </h2>
            <p className="text-xs text-text-muted font-mono">
              {isJudge
                ? "Final Round standardized 100-mark evaluation matrix"
                : "Real-time read-only oversight across all jury clusters"}
            </p>
          </div>
        </div>

        {/* Right Col: Split Form Card */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div
            className={`relative p-6 sm:p-8 bg-surface/90 backdrop-blur-xl rounded-card border transition-all duration-300 shadow-2xl ${
              shake ? "animate-shake border-danger shadow-glow-pink" : "border-border hover:border-border-strong"
            }`}
            style={{
              borderTop: isJudge
                ? "2px solid #FF2E9A"
                : "2px solid #00FF41",
            }}
          >
            {/* Header: Role chip & title */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isJudge
                      ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                      : "bg-signal shadow-[0_0_8px_var(--signal)]"
                  }`}
                />
                <span className="font-mono text-xs text-text-muted uppercase tracking-widest font-semibold">
                  VICEVERSE &apos;26
                </span>
              </div>

              {/* Role Chip */}
              <span
                className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                  isJudge
                    ? "bg-accent/15 text-accent border-accent/40"
                    : "bg-signal/15 text-signal border-signal/40"
                }`}
              >
                {isJudge ? "JUDGE" : "MENTOR OBSERVER"}
              </span>
            </div>

            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {isJudge ? "Judge Authentication" : "Mentor Observer Access"}
              </h1>
              <p className="text-xs text-text-muted leading-relaxed">
                {isJudge
                  ? "Enter your allocated Judge ID and secure 4-digit PIN."
                  : "Enter your allocated Mentor ID and secure 4-digit PIN."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded bg-danger-bg border border-danger/40 flex items-center gap-2.5 text-xs text-danger font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Cooldown Timer */}
            {cooldown > 0 && (
              <div className="mb-5 p-3 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-400 font-mono">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Too many attempts. Lockout active: {cooldown}s</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: Login ID */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-signal inline-block" />
                    LOGIN ID
                  </label>
                  <span
                    className={`text-[10px] ${
                      isIdValid ? "text-signal font-semibold" : "text-text-faint"
                    }`}
                  >
                    Format: {expectedPrefix}XXXXX
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={loginId}
                    onChange={handleIdChange}
                    placeholder={`${expectedPrefix}10001`}
                    maxLength={8}
                    autoComplete="username"
                    className={`w-full px-4 py-3 bg-surface-2 border rounded font-mono text-sm tracking-wider text-white placeholder:text-text-faint focus:outline-none transition-all ${
                      isIdValid
                        ? "border-signal shadow-[0_0_8px_rgba(0,255,65,0.2)]"
                        : "border-border focus:border-accent"
                    }`}
                  />
                  {isIdValid && (
                    <span className="absolute right-3 top-3 text-signal text-xs font-mono font-bold">
                      [OK]
                    </span>
                  )}
                </div>
              </div>

              {/* Field 2: 4-digit PIN */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-signal inline-block" />
                    4-DIGIT PIN
                  </label>
                  <span className="text-[10px] text-text-faint">Square Masked Boxes</span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={pinRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      onPaste={handlePinPaste}
                      className="w-full h-14 bg-surface-2 border border-border rounded text-center text-xl font-mono text-white focus:outline-none focus:border-accent focus:shadow-glow-pink transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant={isJudge ? "primary" : "secondary-green"}
                  size="lg"
                  disabled={!isFormValid || isSubmitting || cooldown > 0}
                  className="w-full font-mono tracking-wider text-sm py-3.5 justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isSubmitting
                    ? "AUTHENTICATING..."
                    : isJudge
                    ? "Enter Judge Portal"
                    : "Enter Mentor Portal"}
                </Button>
              </div>
            </form>

            {/* Bottom link navigating to other portal */}
            <div className="mt-6 pt-5 border-t border-border/50 text-center text-xs font-mono text-text-muted">
              {isJudge ? (
                <span>
                  Looking for the Mentor portal?{" "}
                  <Link
                    href="/mentor/login"
                    className="text-signal hover:underline transition-colors font-medium ml-1"
                  >
                    Go to Mentor Login &rarr;
                  </Link>
                </span>
              ) : (
                <span>
                  Looking for the Judge portal?{" "}
                  <Link
                    href="/judge/login"
                    className="text-accent hover:underline transition-colors font-medium ml-1"
                  >
                    Go to Judge Login &rarr;
                  </Link>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
