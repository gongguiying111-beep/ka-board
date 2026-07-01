import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getOrCreateClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Fallback for build-time SSR — won't actually work at runtime,
    // but allows Next.js static prerendering to complete
    _client = createClient("https://placeholder.supabase.co", "placeholder-key");
  } else {
    _client = createClient(url, key);
  }

  return _client;
}

// Lazy Proxy: defers Supabase client creation to first property access.
// This is critical for Vercel builds — static prerendering evaluates
// module-level code but doesn't actually call Supabase methods.
// Without the Proxy, createClient validates the URL at import time
// and crashes if NEXT_PUBLIC_* env vars aren't present.
export const supabase = new Proxy({} as unknown as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getOrCreateClient();
    const val = Reflect.get(client as object, prop, receiver);
    // Bind methods to the real client so 'this' works correctly
    if (typeof val === "function") {
      return (...args: unknown[]) => (val as Function).apply(client, args);
    }
    return val;
  },
});
