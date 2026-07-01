import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public env vars inlined at build time.
  // Priority: shell env > .env.local > these fallback values.
  // Set these in EdgeOne Pages: Project Settings → Environment Variables.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://gdvhqjtowwlhmkkdtsut.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "sb_publishable_tCl4jnukTcXRtpSv5ihMzg_IMeYwwHh",
  },
};

export default nextConfig;
