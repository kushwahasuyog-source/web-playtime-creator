import { useState } from "react";
import { Check, Copy01 } from "@untitledui/icons";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  return <span className="inline-flex items-center gap-2">
    <Button variant="ghost" size="icon" aria-label={label} title={label} onClick={async () => {
      try { await navigator.clipboard.writeText(text); setStatus("Copied"); }
      catch { setStatus("Copy unavailable"); }
    }}>{status === "Copied" ? <Check /> : <Copy01 />}</Button>
    <span role="status" className="text-xs text-muted-foreground">{status}</span>
  </span>;
}