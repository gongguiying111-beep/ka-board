"use client";

import { useState } from "react";

interface AdminModalProps {
  isOpen: boolean;
  error: string | null;
  onClose: () => void;
  onLogin: (password: string) => void;
}

export default function AdminModal({
  isOpen,
  error,
  onClose,
  onLogin,
}: AdminModalProps) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-[320px] p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">管理员验证</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入管理员密码"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3
                       focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
          />
          {error && (
            <p className="text-xs text-red-500 mb-3">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg
                         hover:bg-gray-800 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
