import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopReferral } from "@/components/referral";
import { Button } from "@/components/ui/button";
import { PEPTIDE_BY_SLUG } from "@/lib/peptides";
import { useLibraryStore } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({ meta: [{ title: "Compare · Peptide Library" }] }),
});

function ComparePage() {
  const compare = useLibraryStore((s) => s.compare);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const clearCompare = useLibraryStore((s) => s.clearCompare);
  const removeCompare = useLibraryStore((s) => s.removeCompare);

  const peptides = hydrated
    ? compare.map((slug) => PEPTIDE_BY_SLUG[slug]).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-fg">Compare</h1>
          <p className="mt-1 text-sm text-muted">
            Side-by-side · up to 4 peptides · stays on this device
          </p>
        </div>
        {peptides.length > 0 && (
          <Button variant="secondary" onClick={clearCompare}>
            Clear all
          </Button>
        )}
      </header>

      {!hydrated ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : peptides.length === 0 ? (
        <div className="rounded-2xl bg-bg-elevated px-5 py-12 text-center shadow-[var(--shadow-border)]">
          <p className="text-fg">Nothing to compare yet</p>
          <p className="mt-1 text-sm text-muted">
            Add peptides from the library using the compare control.
          </p>
          <Button asChild className="mt-4" variant="secondary">
            <Link to="/">Browse library</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 overflow-x-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {peptides.map((p) => (
            <div
              key={p.slug}
              className="min-w-[220px] rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium text-fg">{p.name}</h2>
                <button
                  type="button"
                  onClick={() => removeCompare(p.slug)}
                  className="text-xs text-muted hover:text-fg"
                >
                  Remove
                </button>
              </div>
              <p className="mt-1 text-xs text-muted">{p.fullName}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-4">
                {p.description}
              </p>
              {p.researchRanges && (
                <p className="mt-3 text-xs text-subtle">
                  Research ranges: {p.researchRanges}
                </p>
              )}
              {p.halfLife && (
                <p className="mt-1 text-xs text-subtle">Half-life: {p.halfLife}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <ShopReferral />
    </div>
  );
}
