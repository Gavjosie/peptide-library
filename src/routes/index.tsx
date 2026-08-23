import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PeptideCard } from "@/components/peptide-card";
import { EducationalNotice } from "@/components/notice";
import { ShopReferral } from "@/components/referral";
import { Input } from "@/components/ui/input";
import { CATEGORIES, PEPTIDES, searchText, type CategoryId } from "@/lib/peptides";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "Library · Peptide Library" }] }),
});

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEPTIDES.filter((p) => {
      const matchesCat = category === "all" || p.categories.includes(category);
      const matchesQ = !q || searchText(p).includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, category]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-fg">Library</h1>
        <p className="mt-1 text-sm text-muted">
          {PEPTIDES.length} research peptides · search & filter
        </p>
      </header>

      <EducationalNotice />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Search name, sequence, area…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 flex-1"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              category === "all"
                ? "bg-accent text-accent-fg"
                : "bg-surface text-muted hover:text-fg",
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                category === c.id
                  ? "bg-accent text-accent-fg"
                  : "bg-surface text-muted hover:text-fg",
              )}
            >
              {c.short}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((peptide) => (
          <PeptideCard key={peptide.slug} peptide={peptide} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">No matches.</p>
      )}

      <ShopReferral />
    </div>
  );
}
