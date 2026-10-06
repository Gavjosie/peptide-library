import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Columns2 } from "lucide-react";
import { ChainView } from "@/components/chain-view";
import { EducationalNotice } from "@/components/notice";
import { ShopReferral } from "@/components/referral";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_MAP,
  drawableSequence,
  formatMass,
  getPeptide,
  STATUS_LABEL,
} from "@/lib/peptides";
import { COMPARE_LIMIT, useLibraryStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/peptide/$slug")({
  component: PeptideDetail,
  head: ({ params }) => ({
    meta: [{ title: `${getPeptide(params.slug)?.name ?? "Not found"} · Research Library` }],
  }),
});

function PeptideDetail() {
  const { slug } = Route.useParams();
  const peptide = getPeptide(slug);
  const favorites = useLibraryStore((s) => s.favorites);
  const compare = useLibraryStore((s) => s.compare);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const toggleCompare = useLibraryStore((s) => s.toggleCompare);

  if (!peptide) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-4xl text-fg">Not in the library</h1>
        <p className="mt-2 text-sm text-muted">That entry does not exist.</p>
        <Button asChild className="mt-6" variant="secondary">
          <Link to="/">Back to the library</Link>
        </Button>
      </div>
    );
  }

  const isFav = favorites.includes(peptide.slug);
  const inCompare = compare.includes(peptide.slug);
  const compareFull = compare.length >= COMPARE_LIMIT && !inCompare;
  const sequence = drawableSequence(peptide);

  const facts = [
    peptide.approvalStatus ? ["Status", STATUS_LABEL[peptide.approvalStatus]] : null,
    peptide.form ? ["Form", peptide.form] : null,
    peptide.strength ? ["Presentation", peptide.strength] : null,
    peptide.molecularWeightDa ? ["Mass", `${formatMass(peptide.molecularWeightDa)} Da`] : null,
    peptide.halfLife ? ["Half-life", peptide.halfLife] : null,
    peptide.casNumber ? ["CAS", peptide.casNumber] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" />
        Library
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">
            {peptide.categories.map((id) => CATEGORY_MAP[id]?.label ?? id).join(" · ")}
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight text-fg sm:text-5xl">{peptide.name}</h1>
          <p className="mt-2 text-sm text-muted">{peptide.fullName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={inCompare ? "default" : "secondary"}
            onClick={() => toggleCompare(peptide.slug)}
            disabled={compareFull}
          >
            <Columns2 className="size-4" />
            {inCompare ? "In compare" : "Compare"}
          </Button>
          <Button variant="secondary" onClick={() => toggleFavorite(peptide.slug)} aria-pressed={isFav}>
            <Bookmark className={cn("size-4", isFav && "fill-accent text-accent")} />
            {isFav ? "Saved" : "Save"}
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {peptide.abbreviations.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
        {peptide.approvalStatus && (
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
        )}
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-fg">{peptide.description}</p>

      <div className="grid gap-4 lg:grid-cols-5">
        <dl className="grid content-start gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border sm:grid-cols-2 lg:col-span-2">
          {facts.map(([label, value]) => (
            <div key={label} className="bg-bg-elevated px-4 py-3">
              <dt className="text-xs text-subtle">{label}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-fg">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="lg:col-span-3">
          {sequence ? (
            <ChainView sequence={sequence} note={peptide.sequenceNote} />
          ) : (
            <div className="flex h-full min-h-48 flex-col justify-center rounded-2xl bg-bg-elevated p-5 ring-1 ring-border">
              <p className="text-xs font-medium tracking-widest text-subtle uppercase">Sequence</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {peptide.sequenceNote ?? "A standard one-letter sequence is not listed for this entry."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {peptide.researchAreas.map((area) => (
          <Badge key={area} variant="accent">
            {area}
          </Badge>
        ))}
      </div>

      {peptide.notes && <p className="max-w-3xl text-sm leading-relaxed text-muted">{peptide.notes}</p>}
      {peptide.community && (
        <section className="max-w-3xl rounded-2xl bg-bg-elevated p-5 ring-1 ring-border">
          <h2 className="text-xs font-medium tracking-widest text-subtle uppercase">What the community says</h2>
          <p className="mt-2 text-sm leading-relaxed text-fg">{peptide.community}</p>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Forum anecdotes only. Not a protocol, not a result you should expect, and not medical advice.
          </p>
        </section>
      )}
      {peptide.caution && (
        <p className="max-w-3xl rounded-2xl bg-warn/10 px-4 py-3 text-sm leading-relaxed text-warn ring-1 ring-warn/30">
          {peptide.caution}
        </p>
      )}

      <p className="text-sm">
        {peptide.productUrl && (
          <a href={peptide.productUrl} target="_blank" rel="noreferrer" className="text-accent-soft hover:underline">
            Buy {peptide.name}
          </a>
        )}
      </p>

      <EducationalNotice compact />
      <ShopReferral />
    </div>
  );
}
