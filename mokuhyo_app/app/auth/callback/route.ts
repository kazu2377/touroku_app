import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (!code) {
    url.searchParams.set("auth_error", "missing_code");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  const redirectUrl = new URL(next, url.origin);
  if (error) {
    redirectUrl.searchParams.set("auth_error", error.message);
  }

  return NextResponse.redirect(redirectUrl);
}
