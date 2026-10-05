"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  User,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  Terminal,
  Cpu,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const upperId = loginId.trim().toUpperCase();
  const isJudgePrefix = upperId.startsWith("JDG");
  const isMentorPrefix = upperId.startsWith("MNR");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(loginId, pin);
    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Authentication failed");
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (id: string, code: string) => {
    setLoginId(id);
    setPin(code);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3.5 sm:p-6 lg:p-8 bg-[#080b11] bg-grid-tech relative overflow-hidden">
      {/* Dynamic ambient background orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[550px] lg:w-[650px] h-[320px] sm:h-[550px] lg:h-[650px] bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-blue-600/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Institutional Club Branding Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3.5 sm:mb-5 shadow-inner">
            <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-orange-400 shrink-0" />
            <span>Official Hackathon Evaluation System</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2 sm:gap-3">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              VICEVERSE &apos;26
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium tracking-wide">
            Jury &bull; Mentor Evaluation &amp; Rubric Scoring Terminal
          </p>
        </div>

        {/* Executive Authentication Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-8 lg:p-9 shadow-2xl relative">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-6 sm:left-8 right-6 sm:right-8 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />

          <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-800">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400">
              <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-orange-400" />
              <span>JURY PORTAL ACCESS</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5 sm:gap-3 shadow-lg shadow-red-950/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Login ID Input - text-base prevents auto zoom on iOS */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  Delegate Identification (Login ID)
                </label>

                {/* Live prefix indicator pills */}
                {isJudgePrefix && (
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-400" />
                    Jury
                  </span>
                )}
                {isMentorPrefix && (
                  <span className="text-[9px] sm:text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Eye className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-cyan-400" />
                    Observer
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                  placeholder="e.g. JDG10001 or MNR20001"
                  maxLength={8}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-base sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600 shadow-inner"
                  required
                />
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5 sm:mt-2 flex items-center gap-1 font-mono">
                <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
                Format: 3-character prefix (JDG / MNR) + 5 digits
              </p>
            </div>

            {/* Security PIN Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-400" />
                  Security Passcode (PIN)
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter numeric PIN"
                  maxLength={6}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-base sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600 shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 sm:mt-3 py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Authenticating Identity...</span>
              ) : (
                <>
                  <span>Authenticate &amp; Launch Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Official Delegate Lanyard Passes (Quick Fill) */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 mb-2.5 sm:mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Official Test Accreditation Cards:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Judge Pass */}
              <button
                type="button"
                onClick={() => fillQuickCredentials("JDG10001", "1234")}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-left transition-all active:scale-[0.98] group relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3" />
                    Jury Pass
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">PIN: 1234</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">JDG10001</div>
                <div className="text-[10px] text-slate-400">Dr. Rajesh Kumar (AI)</div>
              </button>

              {/* Mentor Pass */}
              <button
                type="button"
                onClick={() => fillQuickCredentials("MNR20001", "4321")}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 text-left transition-all active:scale-[0.98] group relative overflow-hidden shadow-md"
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 uppercase tracking-wide">
                    <Eye className="w-3 h-3" />
                    Observer Pass
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">PIN: 4321</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">MNR20001</div>
                <div className="text-[10px] text-slate-400">Arjun Verma (Tech)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] sm:text-[11px] text-slate-500 mt-5 sm:mt-6 tracking-wide">
          VICEVERSE Unified Platform &bull; Team 5 (Lead: Annirudh M Jois) &bull; Evaluation Node
        </p>
      </div>
    </div>
  );
}
