import { Link } from "@tanstack/react-router";
import { Code02, Grid01, MessageSmileCircle, Plus } from "@untitledui/icons";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "My bots", icon: MessageSmileCircle },
  { to: "/app/new", label: "AI builder", icon: Plus },
  { to: "/app/templates", label: "Templates", icon: Grid01 },
  { to: "/app/assistant", label: "Coding assistant", icon: Code02 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageSmileCircle className="size-4.5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">BotForge</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/app" }}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/app/new"
            search={{ template: undefined }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Plus className="size-4" /> New bot
          </Link>
        </div>
      </header>

      <nav aria-label="App navigation" className="flex max-w-full gap-2 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/app" }}
            className="inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 py-1.5 text-xs text-muted-foreground data-[status=active]:bg-surface data-[status=active]:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-6xl px-4 py-8 sm:px-6 md:px-10">{children}</main>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "border-accent/50 bg-accent/10 text-accent",
    paused: "border-amber/40 bg-amber/10 text-amber",
    draft: "border-border bg-surface text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest",
        map[status] ?? map["draft"],
      )}
    >
      {status}
    </span>
  );
}
