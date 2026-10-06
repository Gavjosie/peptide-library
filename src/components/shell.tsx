import { Link, Outlet } from "@tanstack/react-router";
import { Columns2, FlaskConical, Library, MessageSquare, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { ShopFooter } from "@/components/referral";
import { hydrateLibraryStore, useLibraryStore } from "@/lib/store";
import { recordVisit } from "@/lib/visits.functions";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Library", icon: Library, exact: true },
  { to: "/compare", label: "Compare", icon: Columns2, exact: false },
  { to: "/tools", label: "Tools", icon: FlaskConical, exact: false },
  { to: "/reviews", label: "Review", icon: MessageSquare, exact: false },
  { to: "/shop", label: "Buy", icon: ShoppingBag, exact: false },
] as const;

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-bg-elevated" />
      <path
        d="M6 22 L16 10 L26 20"
        fill="none"
        className="stroke-accent"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="22" r="3" className="fill-accent" />
      <circle cx="16" cy="10" r="3" className="fill-accent-soft" />
      <circle cx="26" cy="20" r="3" className="fill-accent" />
    </svg>
  );
}

let visitPromise: Promise<number> | null = null;

function VisitCount() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    let cancel = false;
    visitPromise ??= recordVisit().catch((error) => {
      visitPromise = null;
      throw error;
    });
    visitPromise
      .then((count) => {
        if (!cancel) setVisits(count);
      })
      .catch(() => {
        if (!cancel) setVisits(null);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="shrink-0 text-right leading-none" aria-live="polite">
      <p className="text-xs tracking-widest text-subtle uppercase">Visits</p>
      <p className="mt-1 text-sm font-medium text-fg tabular-nums">
        {visits === null ? "—" : visits.toLocaleString()}
      </p>
    </div>
  );
}

export function AppShell() {
  const compare = useLibraryStore((s) => s.compare);
  const hydrated = useLibraryStore((s) => s.hydrated);

  useEffect(() => {
    hydrateLibraryStore();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <Mark />
            <span className="min-w-0">
              <span className="block truncate font-display text-2xl leading-none tracking-tight text-fg">
                Research Library
              </span>
              <span className="mt-1 block text-xs tracking-widest text-subtle uppercase">Gavjosie</span>
            </span>
          </Link>
          <div className="ml-auto flex min-w-0 items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface hover:text-fg",
                )}
                activeProps={{
                  className: "rounded-lg bg-surface px-3 py-2 text-sm font-medium text-accent-soft",
                }}
              >
                {item.label}
                {hydrated && item.to === "/compare" && compare.length > 0 ? ` ${compare.length}` : ""}
              </Link>
            ))}
          </nav>
          <VisitCount />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 pb-28 md:pb-12">
        <Outlet />
      </main>

      <ShopFooter />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const count = hydrated && item.to === "/compare" ? compare.length : 0;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs text-muted"
                activeProps={{
                  className: "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs text-accent-soft",
                }}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-0.5 text-xs font-medium text-accent-fg">
                      {count}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
