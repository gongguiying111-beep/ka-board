"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
      active
        ? "bg-gray-900 text-white"
        : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <nav className="flex items-center gap-2">
      <Link href="/" className={linkClass(pathname === "/")}>
        Project Board
      </Link>
      <Link href="/summary" className={linkClass(pathname === "/summary")}>
        Summary
      </Link>
      <Link href="/daily" className={linkClass(pathname === "/daily")}>
        Daily
      </Link>
    </nav>
  );
}
