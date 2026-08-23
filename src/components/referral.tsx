import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FACEBOOK_URL, SHOP_URL, X_URL } from "@/lib/peptides";

function ShopButton({ className }: { className?: string }) {
  return (
    <Button asChild className={cn("group h-12 px-5", className)}>
      <a href={SHOP_URL} target="_blank" rel="noreferrer">
        Shop
        <ArrowUpRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </Button>
  );
}

export function ReferralBanner({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between",
        compact && "p-4",
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">
          Shop via my referral link
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Research peptides · PayPal & Klarna accepted
        </p>
      </div>
      <ShopButton className="w-full shrink-0 sm:w-auto" />
    </aside>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.59l-5.16-6.74L5.3 22H2.04l8.02-9.16L1.5 2h6.76l4.66 6.18L18.244 2Zm-1.16 18.04h1.8L7.01 3.86H5.08l12 16.18Z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M14.5 8.5V6.7c0-.74.5-1.2 1.28-1.2H17V3h-2.1C12.4 3 11 4.46 11 6.86V8.5H9v2.6h2V21h3.1v-9.9h2.2l.4-2.6h-2.6Z" />
    </svg>
  );
}

export function ContactMe({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between",
        compact && "p-4",
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">Contact me</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">Contact me on X or Facebook</p>
      </div>
      <div className="flex w-full shrink-0 gap-2 sm:w-auto">
        <Button asChild variant="secondary" className="h-12 flex-1 px-5 sm:flex-none">
          <a href={X_URL} target="_blank" rel="noreferrer" aria-label="X">
            <XLogo className="size-4" />
          </a>
        </Button>
        <Button asChild variant="secondary" className="h-12 flex-1 px-5 sm:flex-none">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
            <FacebookLogo className="size-4" />
            Facebook
          </a>
        </Button>
      </div>
    </aside>
  );
}

export function ShopReferral({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <ReferralBanner compact={compact} />
      <ContactMe compact={compact} />
    </div>
  );
}

export function ShopFooter() {
  return (
    <section className="border-t border-border bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="font-display text-2xl tracking-tight text-fg">Shop research peptides</p>
          <p className="mt-1 text-sm text-muted">My referral link · PayPal & Klarna accepted</p>
        </div>
        <ShopButton className="w-full shrink-0 sm:w-auto" />
      </div>
    </section>
  );
}
