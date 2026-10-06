import { Link } from "@tanstack/react-router";
import { Bookmark, Columns2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_MAP, shopProductUrl, type Peptide } from "@/lib/peptides";
import { COMPARE_LIMIT, useLibraryStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductPills({ peptide }: { peptide: Peptide }) {
  const form = peptide.form === "pen" ? "Pen" : peptide.form === "vial" ? "Vial" : null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {form && <Badge>{form}</Badge>}
      {peptide.strength && <Badge>{peptide.strength}</Badge>}
      {peptide.categories.slice(0, 2).map((id) => (
        <Badge key={id}>{CATEGORY_MAP[id]?.short ?? id}</Badge>
      ))}
    </div>
  );
}

export function PeptideCard({ peptide }: { peptide: Peptide }) {
  const favorites = useLibraryStore((s) => s.favorites);
  const compare = useLibraryStore((s) => s.compare);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const toggleCompare = useLibraryStore((s) => s.toggleCompare);
  const isFav = favorites.includes(peptide.slug);
  const inCompare = compare.includes(peptide.slug);
  const compareFull = compare.length >= COMPARE_LIMIT && !inCompare;

  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-bg-elevated p-4 ring-1 ring-border transition-colors duration-200 hover:ring-accent/40">
      <Link
        to="/peptide/$slug"
        params={{ slug: peptide.slug }}
        aria-label={peptide.fullName}
        className="absolute inset-0 z-10 rounded-2xl"
      />
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 font-medium text-fg">{peptide.name}</h3>
        <div className="relative z-20 flex shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleCompare(peptide.slug)}
            disabled={compareFull}
            aria-pressed={inCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            title={compareFull ? `Compare holds ${COMPARE_LIMIT} already` : "Compare"}
          >
            <Columns2 className={cn("size-4", inCompare && "text-accent-soft")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(peptide.slug)}
            aria-pressed={isFav}
            aria-label={isFav ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className={cn("size-4", isFav && "fill-accent text-accent")} />
          </Button>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{peptide.description}</p>
      {peptide.community && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-subtle">What the community says. </span>
          {peptide.community}
        </p>
      )}
      <ProductPills peptide={peptide} />
      {peptide.productUrl && (
        <a
          href={shopProductUrl(peptide.slug)}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 mt-3 inline-flex text-sm font-medium text-accent-soft hover:underline"
        >
          Buy {peptide.name}
        </a>
      )}
    </article>
  );
}
