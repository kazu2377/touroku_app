'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  message: string;
  success?: boolean;
};

export async function sendMagicLink(
  _prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = (formData.get("email") as string | null)?.trim();
  if (!email) {
    return { message: "メールアドレスを入力してください。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { message: `送信に失敗しました: ${error.message}` };
  }

  return {
    message: "魔法のリンクを送信しました。メールを確認してください。",
    success: true,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}
