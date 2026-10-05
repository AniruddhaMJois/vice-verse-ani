"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, UserRole } from "@shared/types/database";
import { judgeService } from "@backend/services/judgeService";

export const DEFAULT_JUDGE_PROFILE: Profile = {
  id: "prof-judge-1",
  login_id: "JDG10001",
  pin: "1234",
  full_name: "Dr. Rajesh Kumar",
  role: "judge",
  created_at: "2026-10-04T00:00:00Z",
};

export const DEFAULT_MENTOR_PROFILE: Profile = {
  id: "prof-mentor-1",
  login_id: "MNR20001",
  pin: "4321",
  full_name: "Arjun Verma",
  role: "mentor",
  created_at: "2026-10-04T00:00:00Z",
};

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isJudge: boolean;
  isMentor: boolean;
  isLoading: boolean;
  login: (loginId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "viceverse_auth_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(DEFAULT_JUDGE_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(DEFAULT_JUDGE_PROFILE);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_JUDGE_PROFILE));
      }
    } catch {
      setUser(DEFAULT_JUDGE_PROFILE);
    }
  }, []);

  const login = async (loginId: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = loginId.trim().toUpperCase();
    const cleanPin = pin.trim();

    // Regex check: 3 uppercase letters followed by 5 digits
    const pattern = /^[A-Z]{3}[0-9]{5}$/;
    if (!pattern.test(cleanId)) {
      return {
        success: false,
        error: "Invalid Login ID format. Must be 3 letters followed by 5 digits (e.g. JDG10001 or MNR20001).",
      };
    }

    if (!cleanPin) {
      return { success: false, error: "Please enter your PIN." };
    }

    try {
      const profile = await judgeService.verifyProfile(cleanId, cleanPin);
      if (!profile) {
        return {
          success: false,
          error: "Invalid Login ID or PIN. Please verify your credentials.",
        };
      }

      setUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Authentication failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    const profile = newRole === "mentor" ? DEFAULT_MENTOR_PROFILE : DEFAULT_JUDGE_PROFILE;
    setUser(profile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
  };

  const isJudge = user?.role === "judge";
  const isMentor = user?.role === "mentor";

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isJudge,
        isMentor,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
