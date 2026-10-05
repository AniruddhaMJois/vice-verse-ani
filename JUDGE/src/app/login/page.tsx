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
      router.push("/workspace");
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
      router.push("/workspace");
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
    <div className="min-h-screen flex items-center justify-center p-3.5 sm:p-6 lg:p-8 bg-[#070512] bg-vice-grid relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] lg:w-[750px] h-[340px] sm:h-[600px] lg:h-[750px] bg-gradient-to-tr from-[#ff2a85]/20 via-[#9333ea]/15 to-[#00f0ff]/15 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-[#00f0ff]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Hackathon Evaluation Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#120d2e]/90 border border-[#ff2a85]/40 text-[#ff2a85] text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-3.5 sm:mb-5 shadow-[0_0_15px_rgba(255,42,133,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2a85] shrink-0" />
            <span>Official Hackathon Evaluation Terminal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2 sm:gap-3">
            <span className="bg-gradient-to-r from-white via-[#ff9ec6] to-[#00f0ff] bg-clip-text text-transparent">
              VICEVERSE &apos;26
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#a594c7] mt-1.5 font-medium tracking-wide">
            Judge &bull; Mentor Evaluation &amp; Rubric Scoring Terminal
          </p>
        </div>

        {/* Executive Authentication Card */}
        <div className="vice-card rounded-2xl p-5 sm:p-8 lg:p-9 shadow-2xl relative border border-[#251749]">
          <div className="flex items-center justify-between pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-[#251749]">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#a594c7]">
              <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#ff2a85]" />
              <span>PORTAL ACCESS</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              ONLINE
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5 sm:gap-3 shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Login ID Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs font-semibold text-[#c5b5e3] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#ff2a85]" />
                  Official Login ID
                </label>
                {isJudgePrefix && (
                  <span className="text-[10px] font-mono font-bold text-[#ff2a85] bg-[#ff2a85]/15 border border-[#ff2a85]/30 px-1.5 py-0.5 rounded">
                    JUDGE
                  </span>
                )}
                {isMentorPrefix && (
                  <span className="text-[10px] font-mono font-bold text-[#00f0ff] bg-[#00f0ff]/15 border border-[#00f0ff]/30 px-1.5 py-0.5 rounded">
                    MENTOR
                  </span>
                )}
              </div>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. JDG10001 or MNR20001"
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#09061a] border border-[#2d1b59] text-white text-base sm:text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#ff2a85]/50 focus:border-[#ff2a85] transition-all placeholder:text-[#5d4c7a]"
                required
                autoCapitalize="characters"
              />
            </div>

            {/* PIN Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs font-semibold text-[#c5b5e3] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#ff2a85]" />
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
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#09061a] border border-[#2d1b59] text-white text-base sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#ff2a85]/50 focus:border-[#ff2a85] transition-all placeholder:text-[#5d4c7a]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b6999] hover:text-white p-1 transition-colors"
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
              className="w-full mt-2 sm:mt-3 py-3 sm:py-3.5 px-4 rounded-xl btn-enter-neon text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99]"
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

          {/* Quick Fill Test Accreditation Cards */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#251749]">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#a594c7] mb-2.5 sm:mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>Official Test Accreditation Cards:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Judge Pass */}
              <button
                type="button"
                onClick={() => fillQuickCredentials("JDG10001", "1234")}
                className="p-3 rounded-xl bg-[#0e0924] hover:bg-[#18113a] border border-[#ff2a85]/40 text-left transition-all active:scale-[0.98] group relative overflow-hidden shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#ff2a85] flex items-center gap-1 uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3" />
                    Judge Pass
                  </span>
                  <span className="text-[10px] text-[#a594c7] font-mono">PIN: 1234</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">JDG10001</div>
                <div className="text-[10px] text-[#7b6999]">Dr. Rajesh Kumar (AI)</div>
              </button>

              {/* Mentor Pass */}
              <button
                type="button"
                onClick={() => fillQuickCredentials("MNR20001", "4321")}
                className="p-3 rounded-xl bg-[#0e0924] hover:bg-[#18113a] border border-[#00f0ff]/40 text-left transition-all active:scale-[0.98] group relative overflow-hidden shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#00f0ff] flex items-center gap-1 uppercase tracking-wide">
                    <Eye className="w-3 h-3" />
                    Mentor Pass
                  </span>
                  <span className="text-[10px] text-[#a594c7] font-mono">PIN: 4321</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">MNR20001</div>
                <div className="text-[10px] text-[#7b6999]">Arjun Verma (Tech)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
