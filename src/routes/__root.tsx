import {
  createRootRoute,
  Link,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ShopFooter } from "@/components/referral";
import { hydrateLibraryStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      { title: "Peptide Library" },
      {
        name: "description",
        content:
          "Educational catalogue for research peptides. Search, compare, save, and tools.",
      },
    ],
  }),
});

const NAV = [
  { to: "/", label: "Library", exact: true },
  { to: "/compare", label: "Compare" },
  { to: "/tools", label: "Tools" },
  { to: "/favorites", label: "Saved" },
  { to: "/progress", label: "My Progress Pics" },
] as const;

function RootLayout() {
  useEffect(() => {
    hydrateLibraryStore();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to="/"
            className="font-display text-xl tracking-tight text-fg hover:text-accent-soft"
          >
            Peptide Library
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  "text-muted hover:bg-surface hover:text-fg",
                  "data-[status=active]:bg-surface data-[status=active]:text-accent-soft",
                )}
                activeOptions={item.exact ? { exact: true } : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <ShopFooter />
      <ScrollRestoration />
    </div>
  );
}
