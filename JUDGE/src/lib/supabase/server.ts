import { getSupabaseUrl, getSupabaseAnonKey } from "./client";

// Server-side Supabase Client stub (cookies-based)
export function createServerClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    if (process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase") {
      throw new Error("Missing Supabase URL or Anon Key on server environment.");
    }
  }

  // When connecting @supabase/ssr:
  // const cookieStore = cookies()
  // return createServerClient(url, key, { cookies: { ... } })
  return null;
}
