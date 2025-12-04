import { signOut } from "@/app/actions/auth";
import { AuthForm } from "@/app/components/auth-form";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home(props: { searchParams?: SearchParams }) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const authError = (searchParams["auth_error"] as string | undefined) ?? "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: goalsData } = user
    ? await supabase.from("goals").select("id, content").limit(5)
    : { data: [] as { id: string; content: string }[] };

  // Supabase can return null for data; normalize to empty array for render logic.
  const goals = goalsData ?? [];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f7f5ff] via-white to-[#e9f0ff] px-6 py-16 text-zinc-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(34,197,235,0.12),transparent_30%)]" />
      <div className="relative grid w-full max-w-5xl gap-10 lg:grid-cols-2">
        <section className="space-y-6">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 shadow-sm ring-1 ring-black/5">
            Mokuhyo App
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-950">
            メール認証でログインして、ゴールを管理しよう
          </h1>
          <p className="max-w-xl text-lg text-zinc-700">
            Supabase のパスワードレス認証（魔法のリンク）を使ったログイン画面です。
            メールのリンクを踏むと自動でサインインされ、ブラウザのセッションに反映されます。
          </p>

          {user ? (
            <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700">ログイン中</p>
                  <p className="text-lg font-semibold text-zinc-950">{user.email}</p>
                </div>
                <form action={signOut}>
                  <button className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50">
                    ログアウト
                  </button>
                </form>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-800">最近のゴール</p>
                <ul className="space-y-2">
                  {goals.length === 0 ? (
                    <li className="text-sm text-zinc-600">データはまだありません。</li>
                  ) : (
                    goals.map((goal) => (
                      <li
                        key={goal.id}
                        className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
                      >
                        {goal.content}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600">
              まだログインしていません。メールアドレスを入力してサインインしてください。
            </p>
          )}
        </section>

        <section className="flex items-start justify-end">
          <AuthForm authError={authError} />
        </section>
      </div>
    </div>
  );
}
