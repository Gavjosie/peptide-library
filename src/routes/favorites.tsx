import { createFileRoute, Link } from "@tanstack/react-router";
import { PeptideCard } from "@/components/peptide-card";
import { ShopReferral } from "@/components/referral";
import { Button } from "@/components/ui/button";
import { PEPTIDE_BY_SLUG } from "@/lib/peptides";
import { useLibraryStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
  head: () => ({ meta: [{ title: "Saved · Peptide Library" }] }),
});

function FavoritesPage() {
  const favorites = useLibraryStore((s) => s.favorites);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const peptides = hydrated
    ? favorites.map((slug) => PEPTIDE_BY_SLUG[slug]).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-fg">Saved</h1>
        <p className="mt-1 text-sm text-muted">Bookmarks stay on this device. Nothing is uploaded.</p>
      </header>
      <ShopReferral />
      {!hydrated ? (
        <p className="text-sm text-muted">Loading saved list…</p>
      ) : peptides.length === 0 ? (
        <div className="rounded-2xl bg-bg-elevated px-5 py-12 text-center shadow-[var(--shadow-border)]">
          <p className="text-fg">No saved peptides yet</p>
          <p className="mt-1 text-sm text-muted">Use the bookmark control on any entry to build a personal list.</p>
          <Button asChild className="mt-4" variant="secondary">
            <Link to="/">Browse library</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {peptides.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} />
          ))}
        </div>
      )}
    </div>
  );
}
