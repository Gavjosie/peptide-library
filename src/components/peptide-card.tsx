import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Peptide } from "@/lib/peptides";
import { CATEGORY_MAP } from "@/lib/peptides";
import { useLibraryStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PeptideCard({ peptide }: { peptide: Peptide }) {
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(peptide.slug);

  return (
    <article className="group flex flex-col rounded-2xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to="/peptide/$slug"
            params={{ slug: peptide.slug }}
            className="font-medium text-fg hover:text-accent-soft"
          >
            {peptide.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-muted">{peptide.fullName}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => toggleFavorite(peptide.slug)}
          aria-label={isFav ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark
            className={cn("size-4", isFav && "fill-accent text-accent")}
          />
        </Button>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {peptide.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {peptide.categories.slice(0, 2).map((id) => (
          <Badge key={id} variant="secondary">
            {CATEGORY_MAP[id]?.short ?? id}
          </Badge>
        ))}
      </div>
    </article>
  );
}
