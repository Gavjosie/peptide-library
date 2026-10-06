import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ProductPills } from "@/components/peptide-card";
import { ShopReferral } from "@/components/referral";
import { Button } from "@/components/ui/button";
import { PEPTIDES, SHOP_URL, type Peptide } from "@/lib/peptides";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({ meta: [{ title: "Shop · Research Library" }] }),
});

function ShopPage() {
  const pens = PEPTIDES.filter((peptide) => peptide.form === "pen");
  const vials = PEPTIDES.filter((peptide) => peptide.form === "vial");
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-fg">Shop</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">Tap a product to open its information. The shop button opens the store.</p>
        </div>
        <Button asChild className="h-12"><a href={SHOP_URL} target="_blank" rel="noreferrer">Open shop<ArrowUpRight className="size-4" /></a></Button>
      </header>
      <ProductGroup title="Pens" products={pens} />
      <ProductGroup title="Vials" products={vials} />
      <ShopReferral />
    </div>
  );
}

function ProductGroup({ title, products }: { title: string; products: Peptide[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium tracking-widest text-subtle uppercase">{title} · {products.length}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((peptide) => (
          <article key={peptide.slug} className="relative flex flex-col rounded-2xl bg-bg-elevated p-4 ring-1 ring-border transition-colors duration-200 hover:ring-accent/40">
            <Link to="/peptide/$slug" params={{ slug: peptide.slug }} aria-label={peptide.fullName} className="absolute inset-0 z-10 rounded-2xl" />
            <h3 className="font-medium text-fg">{peptide.name}</h3>
            {peptide.community && (
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted"><span className="font-medium text-subtle">What the community says. </span>{peptide.community}</p>
            )}
            <ProductPills peptide={peptide} />
            {peptide.productUrl && (
              <a href={peptide.productUrl} target="_blank" rel="noreferrer" className="relative z-20 mt-3 inline-flex text-sm font-medium text-accent-soft hover:underline">Buy this in the shop</a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
