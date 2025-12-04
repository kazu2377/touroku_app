'use client';

import { useActionState } from "react";
import type { AuthState } from "@/app/actions/auth";
import { sendMagicLink } from "@/app/actions/auth";

const initialState: AuthState = { message: "" };

export function AuthForm({ authError }: { authError?: string }) {
  const [state, formAction, pending] = useActionState(
    sendMagicLink,
    initialState,
  );

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-zinc-500">
          Email login
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900">
          送信された魔法のリンクからログインしてください
        </h1>
        <p className="text-sm text-zinc-600">
          メールアドレスを入力すると、サインイン用リンクを送信します。
        </p>
        {authError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            認証エラー: {authError}
          </p>
        ) : null}
      </div>

      <form action={formAction} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-800">
            メールアドレス
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 shadow-inner focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {pending ? "送信中…" : "リンクを送る"}
        </button>
      </form>

      {state?.message ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            state.success
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
