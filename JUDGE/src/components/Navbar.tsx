"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, ShieldCheck, Eye, Database, Radio, Flame } from "lucide-react";
import { isSupabaseConfigured } from "@backend/supabaseClient";

export default function Navbar() {
  const { user, isJudge, isMentor, logout, switchRole } = useAuth();
  const hasSupabase = isSupabaseConfigured();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#251749]/80 bg-[#070512]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand & GTA VI Vice City Emblem */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#ff2a85] via-[#db2777] to-[#00f0ff] p-[1.5px] shadow-lg shadow-[#ff2a85]/30 shrink-0">
            <div className="w-full h-full bg-[#0d0a21] rounded-[10px] flex items-center justify-center font-black text-white text-xs sm:text-sm tracking-wider">
              VV
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-sm sm:text-base tracking-wider bg-gradient-to-r from-white via-[#ff94c2] to-[#00f0ff] bg-clip-text text-transparent">
                VICEVERSE
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-mono font-extrabold bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/40 shadow-sm">
                &apos;26
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#9d8cb8] font-medium hidden xs:block">
              Vice City Hackathon Portal
            </p>
          </div>
        </div>

        {/* Live Status & User Info */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Live System Beacon */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#130d2b] border border-[#342261] text-[11px] font-mono text-[#00f0ff]">
            <Radio className="w-3 h-3 text-[#00f0ff] animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>

          {/* Database link status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-[#2b1853] bg-[#0c0821] text-[#a594c7]">
            <Database className="w-3 h-3 text-[#00f0ff]" />
            <span className="text-[11px] font-mono">{hasSupabase ? "Supabase Cloud" : "Local Mock Node"}</span>
          </div>

          {/* 1-Click Role Switcher (Judge / Mentor testing) */}
          {isJudge ? (
            <button
              onClick={() => switchRole("mentor")}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#ff2a85]/15 hover:bg-[#ff2a85]/25 text-[#ff2a85] border border-[#ff2a85]/40 shadow-[0_0_12px_rgba(255,42,133,0.3)] transition-all cursor-pointer"
              title="Click to preview Mentor mode"
            >
              <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#ff2a85] shrink-0" />
              <span>Judge Panel</span>
              <span className="text-[9px] font-mono text-[#ff9ec6] ml-1 hidden md:inline">[Switch to Mentor]</span>
            </button>
          ) : (
            <button
              onClick={() => switchRole("judge")}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
              title="Click to preview Judge mode"
            >
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00f0ff] shrink-0" />
              <span>Mentor Observer</span>
              <span className="text-[9px] font-mono text-[#a5f3fc] ml-1 hidden md:inline">[Switch to Judge]</span>
            </button>
          )}

          {/* User Details */}
          <div className="text-right hidden sm:block pl-2 border-l border-[#251749]">
            <div className="text-xs font-bold text-white tracking-wide truncate max-w-[130px] lg:max-w-[200px]">
              {user.full_name}
            </div>
            <div className="text-[10px] font-mono text-[#a594c7]">{user.login_id}</div>
          </div>

          {/* Logout Action */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-[#a594c7] hover:text-white hover:bg-[#1a1138] border border-[#2d1b59] hover:border-[#ff2a85]/50 transition-all active:scale-95"
            title="Sign out of Portal"
          >
            <LogOut className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
