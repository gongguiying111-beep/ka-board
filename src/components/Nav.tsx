"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
      active
        ? "text-white"
        : "text-gray-400 hover:text-gray-600"
    }`;
  const activeStyle = { backgroundColor: "#00956F" };

  return (
    <nav className="flex items-center gap-2">
      <Link href="/" className={linkClass(pathname === "/")} style={pathname === "/" ? activeStyle : undefined}>
        Board
      </Link>
      <Link href="/summary" className={linkClass(pathname === "/summary")} style={pathname === "/summary" ? activeStyle : undefined}>
        Summary
      </Link>
      <Link href="/daily" className={linkClass(pathname === "/daily")} style={pathname === "/daily" ? activeStyle : undefined}>
        Daily
      </Link>
    </nav>
  );
}
