import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

export function getSupabaseUrl(): string | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.trim();
  const projectId = (
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ||
    process.env.SUPABASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SUPABASE_REF
  )?.trim();

  if (url && url !== "" && !url.includes("your-project")) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}.supabase.co`;
  }

  if (projectId && projectId !== "" && !projectId.includes("your_project")) {
    if (projectId.startsWith("http://") || projectId.startsWith("https://")) {
      return projectId;
    }
    if (projectId.includes(".supabase.co")) {
      return `https://${projectId}`;
    }
    return `https://${projectId}.supabase.co`;
  }

  return null;
}

export function getSupabaseAnonKey(): string | null {
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY ||
    process.env.SUPABASE_ANON_KEY
  )?.trim();

  if (key && key !== "" && !key.includes("...") && !key.includes("your-anon-key")) {
    return key;
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const explicitDataSource = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim();
  if (explicitDataSource === "mock") return false;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    if (!url || !key) return null;
    return createSupabaseClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  if (!clientInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    if (url && key) {
      clientInstance = createSupabaseClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
  }

  return clientInstance;
}

export function createClient(): SupabaseClient | null {
  return getSupabaseClient();
}
