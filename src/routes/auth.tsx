import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageSmileCircle } from "@untitledui/icons";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

const title = "Sign in — BotForge";
const description =
  "Create a BotForge account to build, connect and deploy AI-powered Telegram bots.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (signUpError) throw signUpError;
        if (data.session) navigate({ to: "/app" });
        else setNotice("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate({ to: "/app" });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-6 py-16">
      <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-panel p-8 shadow-panel">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageSmileCircle className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">BotForge</span>
        </Link>

        <h1 className="mt-7 text-2xl font-semibold">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Start building Telegram bots in minutes."
            : "Sign in to your bots dashboard."}
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="At least 6 characters"
            />
          </label>

          {error ? <p className="text-sm text-urgent">{error}</p> : null}
          {notice ? <p className="text-sm text-accent">{notice}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground ring-soft transition-all hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to BotForge?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError(null);
              setNotice(null);
            }}
            className="font-semibold text-accent hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
