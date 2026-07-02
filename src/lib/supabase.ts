import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

// Hardcoded Supabase credentials — avoids Vercel env var issues
const SUPABASE_URL = "https://gdvhqjtowwlhmkkdtsut.supabase.co";
const SUPABASE_KEY = "sb_publishable_tCl4jnukTcXRtpSv5ihMzg_IMeYwwHh";

function getOrCreateClient(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_KEY);
  return _client;
}

// Lazy Proxy: defers Supabase client creation to first property access.
// This is critical for static prerendering — it evaluates module-level
// code but doesn't actually call Supabase methods. Without the Proxy,
// createClient validates the URL at import time and crashes if
// NEXT_PUBLIC_* env vars aren't present during build.
export const supabase = new Proxy({} as unknown as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getOrCreateClient();
    const val = Reflect.get(client as object, prop, receiver);
    // Bind methods to the real client so 'this' works correctly
    if (typeof val === "function") {
      return (...args: unknown[]) =>
        (val as (...a: unknown[]) => unknown).apply(client, args);
    }
    return val;
  },
});
