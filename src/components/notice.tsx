import { EDUCATIONAL_NOTICE } from "@/lib/peptides";
import { cn } from "@/lib/utils";

export function EducationalNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      role="note"
      className={
        compact
          ? "rounded-xl bg-bg-elevated px-3 py-2.5 text-xs leading-relaxed text-muted shadow-[var(--shadow-border)]"
          : "rounded-2xl bg-bg-elevated px-5 py-4 text-sm leading-relaxed text-muted shadow-[var(--shadow-border)]"
      }
    >
      <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Educational notice</p>
      <p className={cn(compact ? "mt-1" : "mt-2")}>{EDUCATIONAL_NOTICE}</p>
    </aside>
  );
}
