import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public env vars inlined at build time.
  // .env.local overrides these locally; Vercel uses these as fallback.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://gdvhqjtowwlhmkkdtsut.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_tCl4jnukTcXRtpSv5ihMzg_IMeYwwHh",
  },
};

export default nextConfig;
