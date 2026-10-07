"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, UserRole } from "@/lib/data/types";
import { dataRepositories } from "@/lib/data";

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  isJudge: boolean;
  isMentor: boolean;
  isLoading: boolean;
  login: (loginId: string, pin: string, expectedRole: UserRole) => Promise<{ success: boolean; error?: string }>;
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
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    loginId: string,
    pin: string,
    expectedRole: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = loginId.trim().toUpperCase();
    const cleanPin = pin.trim();

    // ID format validation: 3 uppercase letters followed by 5 digits
    const pattern = /^[A-Z]{3}[0-9]{5}$/;
    if (!pattern.test(cleanId)) {
      return {
        success: false,
        error: "Invalid ID or PIN",
      };
    }

    // Role prefix check: JDG for judge, MNR for mentor
    if (expectedRole === "judge" && !cleanId.startsWith("JDG")) {
      return { success: false, error: "Invalid ID or PIN" };
    }
    if (expectedRole === "mentor" && !cleanId.startsWith("MNR")) {
      return { success: false, error: "Invalid ID or PIN" };
    }

    try {
      const res = await dataRepositories.auth.signIn(cleanId, cleanPin, expectedRole);
      if (!res.success || !res.profile) {
        return {
          success: false,
          error: res.error || "Invalid ID or PIN",
        };
      }

      setUser(res.profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(res.profile));
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Invalid ID or PIN",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dataRepositories.auth.signOut().catch(() => {});
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
