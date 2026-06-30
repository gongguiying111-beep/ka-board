"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/auth";
import Nav from "./Nav";
import AdminModal from "./AdminModal";

export default function Header() {
  const { isAdmin, login, logout, error } = useAdmin();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="shrink-0 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-900 tracking-wide">
            KA Board
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              isAdmin
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {isAdmin ? "编辑模式" : "只读模式"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Nav />
          {isAdmin ? (
            <button
              onClick={logout}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              退出编辑
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              管理员模式
            </button>
          )}
        </div>
      </header>

      <AdminModal
        isOpen={showModal}
        error={error}
        onClose={() => setShowModal(false)}
        onLogin={async (pw) => {
          const ok = await login(pw);
          if (ok) setShowModal(false);
        }}
      />
    </>
  );
}
