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

  // Cookie 書き込みを許可しないとセッション用のリフレッシュトークンが保存されない
  const supabase = await createClient({ allowCookieWrite: true });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  const redirectUrl = new URL(next, url.origin);
  if (error) {
    redirectUrl.searchParams.set("auth_error", error.message);
  }

  return NextResponse.redirect(redirectUrl);
}
