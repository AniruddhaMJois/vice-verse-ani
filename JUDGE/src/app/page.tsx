"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Sparkles, ShieldCheck, Eye, LogIn } from "lucide-react";

export default function GatewayPage() {
  const router = useRouter();
  const { user, isJudge, isMentor, isLoading } = useAuth();

  const handleEnter = () => {
    router.push("/workspace");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#070512] bg-vice-grid relative overflow-hidden">
      {/* Ambient glowing neon backdrop filters */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] lg:w-[750px] h-[340px] sm:h-[600px] lg:h-[750px] bg-gradient-to-tr from-[#ff2a85]/20 via-[#9333ea]/15 to-[#00f0ff]/15 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-12 left-12 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center space-y-8 sm:space-y-10">
        {/* Hackathon Accreditation Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120d2e]/90 border border-[#ff2a85]/40 text-[#ff2a85] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,42,133,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
          <span>VICEVERSE &apos;26 &bull; OFFICIAL EVALUATION PORTAL</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans">
            <span className="bg-gradient-to-r from-white via-[#ff9ec6] to-[#00f0ff] bg-clip-text text-transparent">
              HACKATHON EVALUATION
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#a594c7] font-medium tracking-wide max-w-lg mx-auto leading-relaxed">
            {user ? (
              <>
                Active Evaluator: <span className="text-white font-bold">{user.full_name}</span> ({user.login_id}) &bull;{" "}
                {isJudge ? (
                  <span className="text-[#ff2a85] font-bold">Judge Panel</span>
                ) : (
                  <span className="text-[#00f0ff] font-bold">Mentor Observer</span>
                )}
              </>
            ) : (
              <span>ViceVerse &apos;26 Official Judging &amp; Mentor Evaluation Platform</span>
            )}
          </p>
        </div>

        {/* Central Main Action Button: ENTER EVALUATION */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-5 rounded-2xl btn-enter-neon text-white font-black text-base sm:text-lg tracking-wider uppercase flex items-center justify-center gap-3 sm:gap-4 mx-auto group active:scale-[0.98] transition-transform"
          >
            <span>ENTER EVALUATION</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Metadata & System Status */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-6 border-t border-[#1d143d]/80 text-xs font-mono text-[#7b6999]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span>PORTAL READY</span>
          </div>
          <div>&bull;</div>
          <div>TEAM 5 ASSIGNED NODE</div>
          <div>&bull;</div>
          <div>
            {user ? (
              isJudge ? (
                <span className="text-[#ff2a85] font-bold">JURY MODE</span>
              ) : (
                <span className="text-[#00f0ff] font-bold">OBSERVER MODE</span>
              )
            ) : (
              <span className="text-[#00f0ff]">AUTHENTICATION REQUIRED</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
