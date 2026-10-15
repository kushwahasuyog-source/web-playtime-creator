import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Check } from "@untitledui/icons";
import { Button } from "@/components/ui/button";
import { addBotCommand } from "@/lib/bots.functions";
import { getDeviceId } from "@/lib/device";
import { commandLibrary } from "@/lib/command-library";

export function CommandLibrary({ botId, existing }: { botId: string; existing: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const cache = useQueryClient();
  const run = useServerFn(addBotCommand);
  const mutation = useMutation({
    mutationFn: () => run({ data: { deviceId: getDeviceId(), botId, command: selected ?? "", reply } }),
    onSuccess: () => { setSelected(null); void cache.invalidateQueries({ queryKey: ["bot", botId] }); },
  });
  return <section className="border-t border-border pt-6">
    <h2 className="text-base font-semibold">Popular commands</h2>
    <div className="mt-4 flex flex-wrap gap-2">
      {commandLibrary.map(item => <Button key={item.command} variant="outline" disabled={existing.includes(item.command) || mutation.isPending} onClick={() => { setSelected(item.command); setReply(item.reply); mutation.reset(); }}>
        {existing.includes(item.command) ? <Check /> : <Plus />} <span className="font-mono">{item.command}</span>
      </Button>)}
    </div>
    {selected && <form className="mt-4 space-y-3" onSubmit={event => { event.preventDefault(); mutation.mutate(); }}>
      <label htmlFor="command-reply" className="block text-sm font-medium">Reply for {selected}</label>
      <textarea id="command-reply" value={reply} onChange={event => setReply(event.target.value)} required maxLength={4096} rows={3} className="w-full rounded-lg border border-input bg-surface p-3 text-sm" />
      <Button type="submit" disabled={mutation.isPending || !reply.trim()}>{mutation.isPending ? "Adding…" : "Add command"}</Button>
      <Button type="button" variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
    </form>}
    {mutation.isError && <p role="alert" className="mt-3 text-sm text-destructive">Could not add this command. Please try again.</p>}
    {mutation.isSuccess && <p role="status" className="mt-3 text-sm text-accent">Command added.</p>}
  </section>;
}