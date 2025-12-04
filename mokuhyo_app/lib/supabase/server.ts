import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

type CreateClientOptions = {
  allowCookieWrite?: boolean;
};

export async function createClient(options: CreateClientOptions = {}) {
  const { allowCookieWrite = false } = options;
  const cookieStore = await cookies();
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Next.js restricts cookie mutation to Route Handlers or Server Actions.
        if (!allowCookieWrite) return;
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        if (!allowCookieWrite) return;
        cookieStore.delete({ name, ...options });
      },
    },
  });
}
