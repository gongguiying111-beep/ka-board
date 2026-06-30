"use client";

import { AdminProvider } from "@/lib/auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
