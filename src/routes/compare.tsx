import { createFileRoute, Link } from "@tanstack/react-router";
import { ShopReferral } from "@/components/referral";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_MAP,
  formatMass,
  PEPTIDE_BY_SLUG,
  STATUS_LABEL,
  type Peptide,
} from "@/lib/peptides";
import { useLibraryStore } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({ meta: [{ title: "Compare · Research Library" }] }),
});

const ROWS: { label: string; value: (peptide: Peptide) => string }[] = [
  {
    label: "Status",
    value: (peptide) => (peptide.approvalStatus ? STATUS_LABEL[peptide.approvalStatus] : "—"),
  },
  {
    label: "Categories",
    value: (peptide) => peptide.categories.map((id) => CATEGORY_MAP[id]?.short ?? id).join(", "),
  },
  { label: "Form", value: (peptide) => peptide.form ?? "—" },
  { label: "Presentation", value: (peptide) => peptide.strength ?? "—" },
  {
    label: "Mass",
    value: (peptide) => (peptide.molecularWeightDa ? `${formatMass(peptide.molecularWeightDa)} Da` : "—"),
  },
  { label: "Half-life", value: (peptide) => peptide.halfLife ?? "—" },
  { label: "Sequence", value: (peptide) => peptide.sequence ?? peptide.sequenceNote ?? "—" },
  { label: "Topics", value: (peptide) => peptide.researchAreas.join(", ") },
  { label: "Caution", value: (peptide) => peptide.caution ?? "—" },
];

function ComparePage() {
  const compare = useLibraryStore((s) => s.compare);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const clearCompare = useLibraryStore((s) => s.clearCompare);
  const removeCompare = useLibraryStore((s) => s.removeCompare);

  const peptides = hydrated ? compare.map((slug) => PEPTIDE_BY_SLUG[slug]).filter(Boolean) : [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-fg">Compare</h1>
          <p className="mt-2 text-sm text-muted">Up to 4 peptides, side by side. Saved on this device only.</p>
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
        <div className="rounded-2xl bg-bg-elevated px-5 py-12 text-center ring-1 ring-border">
          <p className="text-fg">Nothing to compare yet</p>
          <p className="mt-1 text-sm text-muted">Use the columns icon on any library card.</p>
          <Button asChild className="mt-4" variant="secondary">
            <Link to="/">Browse library</Link>
          </Button>
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl ring-1 ring-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-bg-elevated">
                <th className="sticky left-0 bg-bg-elevated px-4 py-3 text-xs font-medium tracking-widest text-subtle uppercase">
                  Field
                </th>
                {peptides.map((peptide) => (
                  <th key={peptide.slug} className="min-w-48 px-4 py-3 align-top font-medium text-fg">
                    <Link
                      to="/peptide/$slug"
                      params={{ slug: peptide.slug }}
                      className="hover:text-accent-soft"
                    >
                      {peptide.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeCompare(peptide.slug)}
                      className="mt-1 block text-xs font-normal text-muted hover:text-fg"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <th className="sticky left-0 bg-bg px-4 py-3 text-xs font-medium text-subtle">{row.label}</th>
                  {peptides.map((peptide) => (
                    <td key={peptide.slug} className="px-4 py-3 align-top leading-relaxed text-muted">
                      {row.label === "Status" && peptide.approvalStatus ? (
                        <Badge
                          variant={
                            peptide.approvalStatus === "approved"
                              ? "accent"
                              : peptide.approvalStatus === "mixed"
                                ? "warn"
                                : "default"
                          }
                        >
                          {STATUS_LABEL[peptide.approvalStatus]}
                        </Badge>
                      ) : (
                        row.value(peptide)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ShopReferral />
    </div>
  );
}
