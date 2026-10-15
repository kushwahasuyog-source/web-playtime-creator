export function LoadingState({ label }: { label: string }) {
  return <div role="status" className="mt-8 space-y-3" aria-live="polite">
    <p className="font-mono text-sm text-muted-foreground">{label}</p>
    <div className="h-20 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" aria-hidden="true" />
    <div className="h-20 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" aria-hidden="true" />
  </div>;
}