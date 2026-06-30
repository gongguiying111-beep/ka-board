"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextValue {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore admin state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("ka_admin");
    if (stored === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setIsAdmin(true);
        sessionStorage.setItem("ka_admin", "true");
        return true;
      }
      setError(data.error || "验证失败");
      return false;
    } catch {
      setError("网络错误");
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("ka_admin");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
