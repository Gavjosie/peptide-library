import { EDUCATIONAL_NOTICE } from "@/lib/peptides";
import { cn } from "@/lib/utils";

export function EducationalNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      role="note"
      className={cn(
        "rounded-2xl bg-bg-elevated px-5 py-4 text-sm leading-relaxed text-muted ring-1 ring-border",
        compact && "rounded-xl px-3 py-2.5 text-xs",
      )}
    >
      <p className="text-xs font-medium tracking-widest text-subtle uppercase">Educational notice</p>
      <p className={compact ? "mt-1" : "mt-2"}>{EDUCATIONAL_NOTICE}</p>
    </aside>
  );
}
