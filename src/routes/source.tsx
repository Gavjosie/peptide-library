import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/source")({
  component: SourcePage,
  head: () => ({
    meta: [{ title: "Download source · Peptide Library" }],
  }),
});

function SourcePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">Export</p>
        <h1 className="mt-1 font-display text-4xl tracking-tight text-fg">Download source</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Chat download cards often fail on phones. Use these buttons instead. On Android, tap a
          button; if nothing happens, tap and hold → Open in browser / Save to Files.
        </p>
      </header>
      <div className="flex flex-col gap-3">
        <Button asChild className="h-14 w-full text-base">
          <a href="/peptide-library-source.zip" download="peptide-library-source.zip">
            <Download className="size-4" />
            Download ZIP
          </a>
        </Button>
        <Button asChild variant="secondary" className="h-14 w-full text-base">
          <a href="/peptide-library-source.txt" download="peptide-library-source.txt">
            <Download className="size-4" />
            Download text (.txt)
          </a>
        </Button>
        <a
          href="https://github.com/Gavjosie/peptide-library"
          target="_blank"
          rel="noreferrer"
          className="flex h-14 items-center justify-center rounded-lg border border-border text-sm font-medium text-fg"
        >
          Open GitHub repo
        </a>
      </div>
    </div>
  );
}
