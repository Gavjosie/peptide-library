import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EducationalNotice } from "@/components/notice";
import { PeptideCard } from "@/components/peptide-card";
import { ShopReferral } from "@/components/referral";
import { Input } from "@/components/ui/input";
import { CATEGORIES, PEPTIDES, searchText, type CategoryId } from "@/lib/peptides";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LibraryPage,
  head: () => ({ meta: [{ title: "Research Library" }] }),
});

function LibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEPTIDES.filter((peptide) => {
      const matchesCat = category === "all" || peptide.categories.includes(category);
      const matchesQ = !q || searchText(peptide).includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, category]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-fg sm:text-5xl">Library</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Search by name or topic. Bookmarks stay on this device.
        </p>
      </header>

      <EducationalNotice />

      <div className="flex flex-col gap-3">
        <Input
          type="search"
          placeholder="Search name, pen, vial…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search peptides"
        />
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </FilterChip>
          {CATEGORIES.map((item) => (
            <FilterChip key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
              {item.short}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="text-xs text-subtle">
        {filtered.length} of {PEPTIDES.length}
      </p>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((peptide) => (
          <PeptideCard key={peptide.slug} peptide={peptide} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl bg-bg-elevated px-5 py-12 text-center text-sm text-muted ring-1 ring-border">
          No matches. Try another name or clear the filter.
        </p>
      )}

      <ShopReferral />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
        active ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
