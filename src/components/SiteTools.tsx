import { useEffect, useState } from "react";
import { ArrowUp, Moon01, SearchLg, Sun } from "@untitledui/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

const destinations = [
  ["Home", "/"], ["My bots", "/app"], ["AI bot builder", "/app/new"],
  ["Telegram templates", "/app/templates"], ["AI coding assistant", "/app/assistant"],
  ["How it works", "/#how"], ["Features", "/#features"], ["Pricing", "/#pricing"],
  ["Frequently asked questions", "/#faq"],
];

export function SiteTools() {
  const [light, setLight] = useState(false);
  const [search, setSearch] = useState(false);
  const [notice, setNotice] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    try {
      const theme = localStorage.getItem("botforge:theme") === "light";
      setLight(theme);
      document.documentElement.dataset.theme = theme ? "light" : "dark";
      setNotice(!localStorage.getItem("botforge:cookie-notice"));
      const params = new URLSearchParams(location.search);
      const utm = Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
        .flatMap(key => params.has(key) ? [[key, params.get(key)?.slice(0, 200)]] : []));
      if (Object.keys(utm).length) sessionStorage.setItem("botforge:utm", JSON.stringify(utm));
    } catch { /* Storage may be disabled; controls still work. */ }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max > 0 ? Math.min(100, scrollY / max * 100) : 0);
      });
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); setSearch(value => !value);
      }
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    addEventListener("keydown", shortcut);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", update); removeEventListener("resize", update); removeEventListener("keydown", shortcut); };
  }, []);
  function toggleTheme() {
    const next = !light;
    setLight(next); document.documentElement.dataset.theme = next ? "light" : "dark";
    try { localStorage.setItem("botforge:theme", next ? "light" : "dark"); } catch { /* Optional persistence. */ }
  }
  return <>
    <div className="scroll-progress print:hidden" aria-hidden="true" style={{ width: `${progress}%` }} />
    <div className="site-tools fixed bottom-5 right-4 z-40 flex flex-col gap-2 print:hidden">
      {progress > 8 && <Button variant="secondary" size="icon" aria-label="Back to top" title="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowUp /></Button>}
      <Button variant="secondary" size="icon" aria-label="Search website" title="Search website" onClick={() => setSearch(true)}><SearchLg /></Button>
      <Button variant="secondary" size="icon" aria-label={light ? "Switch to dark mode" : "Switch to light mode"} title={light ? "Switch to dark mode" : "Switch to light mode"} onClick={toggleTheme}>{light ? <Moon01 /> : <Sun />}</Button>
    </div>
    <Dialog open={search} onOpenChange={setSearch}>
      <DialogContent className="max-w-[calc(100%-2rem)] p-4 sm:max-w-lg">
        <DialogTitle>Search BotForge</DialogTitle>
        <DialogDescription className="sr-only">Find pages and website sections.</DialogDescription>
        <Command>
          <CommandInput aria-label="Search pages" placeholder="Search pages" />
          <CommandList><CommandEmpty>No matching pages.</CommandEmpty>
            {destinations.map(([label, href]) => <CommandItem key={href} value={label} onSelect={() => { setSearch(false); window.location.assign(href); }}>{label}</CommandItem>)}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
    {notice && <aside aria-label="Cookie notice" className="cookie-notice fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-border bg-popover p-4 shadow-panel print:hidden">
      <p className="text-sm">BotForge stores your browser workspace and preferences locally. No optional tracking cookies are added by these controls.</p>
      <Button className="mt-3" onClick={() => { setNotice(false); try { localStorage.setItem("botforge:cookie-notice", "acknowledged"); } catch { /* Optional persistence. */ } }}>Got it</Button>
    </aside>}
  </>;
}