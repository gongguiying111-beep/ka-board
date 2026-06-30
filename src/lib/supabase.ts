import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your_supabase_url") {
    // Return a client that will fail at call-time with a clear error,
    // but does not crash at import-time (allows builds without real env vars).
    return createClient("http://localhost:54321", "placeholder", {
      db: { schema: "public" },
    });
  }

  return createClient(url, key);
}

export const supabase = getSupabase();
