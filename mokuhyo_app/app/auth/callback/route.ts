import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  // Use explicit site URL when provided to avoid internal hostnames behind ALB/ECS.
  const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (!code) {
    url.searchParams.set("auth_error", "missing_code");
    return NextResponse.redirect(url);
  }

  // Cookie 書き込みを許可しないとセッション用のリフレッシュトークンが保存されない
  const supabase = await createClient({ allowCookieWrite: true });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  const redirectUrl = new URL(next, baseUrl);
  if (error) {
    redirectUrl.searchParams.set("auth_error", error.message);
  }

  return NextResponse.redirect(redirectUrl);
}
