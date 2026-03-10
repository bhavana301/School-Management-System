"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { DEMO_USERS } from "@/config/auth";
import { hasPermission as checkPermission } from "@/config/permissions";
import { getSessionCookie, setSessionCookie, clearSessionCookie } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

function loadUserFromCookie(): User | null {
  if (typeof window === "undefined") return null;
  const raw = getSessionCookie();
  if (!raw) return null;
  try {
    const { user } = JSON.parse(decodeURIComponent(raw));
    return user ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const u = loadUserFromCookie();
    setUser(u);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }
    const sessionUser: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
    };
    setSessionCookie(sessionUser);
    setUser(sessionUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSessionCookie();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      return checkPermission(user.role, permission as never);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
