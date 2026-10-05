"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, UserRole } from "@shared/types/database";
import { judgeService } from "@backend/services/judgeService";

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isJudge: boolean;
  isMentor: boolean;
  isLoading: boolean;
  login: (loginId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "viceverse_auth_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoading(false);
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
