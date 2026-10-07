// Browser Supabase Client stub
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase") {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.");
    }
  }

  // When connecting @supabase/ssr or @supabase/supabase-js:
  // return createBrowserClient(url, key)
  return null;
}
