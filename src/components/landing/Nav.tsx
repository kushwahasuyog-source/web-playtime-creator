import { Menu01, MessageSmileCircle, XClose } from "@untitledui/icons";
import { useState } from "react";
import { ActionLink } from "./primitives";

const links = [
  { label: "How it works", href: "#how" },
  { label: "Builder", href: "#builder" },
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageSmileCircle className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">BotForge</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/app"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            My bots
          </a>
          <ActionLink href="/app" className="hidden px-4 py-2 md:inline-flex">
            Create your bot
          </ActionLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground md:hidden"
          >
            {open ? <XClose className="size-5" /> : <Menu01 className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/app"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              My bots
            </a>
          </div>
          <ActionLink href="/app" className="mt-3 w-full">
            Create your bot
          </ActionLink>
        </nav>
      ) : null}
    </header>
  );
}
