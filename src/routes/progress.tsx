import { createFileRoute } from "@tanstack/react-router";
import { ShopReferral } from "@/components/referral";
import { EducationalNotice } from "@/components/notice";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
  head: () => ({ meta: [{ title: "My Progress Pics · Peptide Library" }] }),
});

const PICS = [
  {
    src: "/progress/before-after-selfie.jpg",
    caption: "Then vs Now — street selfie",
    alt: "Progress selfie: before (left) and after (right)",
  },
  {
    src: "/progress/side-before-after.jpg",
    caption: "Then vs Now — side profile",
    alt: "Progress side view: before (left) and after (right)",
  },
  {
    src: "/progress/front-before-after.jpg",
    caption: "Then vs Now — front view",
    alt: "Progress front view: after (left) and before (right)",
  },
];

function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">
          Personal
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-tight text-fg">
          My Progress Pics
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Before &amp; after from the journey. Clean grid, mobile-friendly.
        </p>
      </header>

      <EducationalNotice compact />

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {PICS.map((pic) => (
          <figure
            key={pic.src}
            className="overflow-hidden rounded-2xl bg-bg-elevated shadow-[var(--shadow-border)]"
          >
            <img
              src={pic.src}
              alt={pic.alt}
              className="aspect-[4/5] w-full object-cover object-center"
              loading="lazy"
            />
            <figcaption className="px-4 py-3 text-sm text-muted">
              {pic.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <ShopReferral />
    </div>
  );
}
