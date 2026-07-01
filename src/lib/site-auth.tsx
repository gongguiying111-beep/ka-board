"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface SiteAuthContextValue {
  authenticated: boolean;
  login: (password: string) => Promise<boolean>;
  error: string | null;
}

const SiteAuthContext = createContext<SiteAuthContextValue>({
  authenticated: false,
  login: async () => false,
  error: null,
});

export function useSiteAuth() {
  return useContext(SiteAuthContext);
}

export function SiteAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore auth state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("ka_site_auth");
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecked(true);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem("ka_site_auth", "true");
        setAuthenticated(true);
        return true;
      }
      setError(data.error || "密码错误");
      return false;
    } catch {
      setError("验证失败，请重试");
      return false;
    }
  };

  if (!checked) return null;

  return (
    <SiteAuthContext.Provider value={{ authenticated, login, error }}>
      {children}
    </SiteAuthContext.Provider>
  );
}

export function SiteGate({ children }: { children: ReactNode }) {
  const { authenticated, login, error } = useSiteAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (authenticated) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await login(input.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-[300px] text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">KA Board</h1>
        <p className="text-xs text-gray-400 mb-6">输入密码以访问系统</p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          placeholder="密码"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                     placeholder:text-gray-300 text-center mb-3"
        />
        {error && (
          <p className="text-xs text-red-500 mb-3">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-xs font-medium text-white bg-gray-900 rounded-lg
                     hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "验证中..." : "进入"}
        </button>
      </form>
    </div>
  );
}
