import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EducationalNotice } from "@/components/notice";
import { ShopReferral } from "@/components/referral";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
  head: () => ({ meta: [{ title: "Tools · Research Library" }] }),
});

const EXAMPLES = [
  { label: "5 mg · 2 mL · 250 mcg", vial: "5", water: "2", dose: "250" },
  { label: "10 mg · 2 mL · 500 mcg", vial: "10", water: "2", dose: "500" },
  { label: "2 mg · 1 mL · 100 mcg", vial: "2", water: "1", dose: "100" },
];

function ToolsPage() {
  const [vialMg, setVialMg] = useState("5");
  const [waterMl, setWaterMl] = useState("2");
  const [doseMcg, setDoseMcg] = useState("250");

  const result = useMemo(() => {
    const mg = parseFloat(vialMg);
    const ml = parseFloat(waterMl);
    const mcg = parseFloat(doseMcg);
    if (!Number.isFinite(mg) || !Number.isFinite(ml) || !Number.isFinite(mcg)) return null;
    if (mg <= 0 || ml <= 0 || mcg <= 0) return null;
    const concentration = (mg * 1000) / ml;
    const drawMl = mcg / concentration;
    const drawUnits = drawMl * 100;
    const draws = (mg * 1000) / mcg;
    return { concentration, drawMl, drawUnits, draws };
  }, [vialMg, waterMl, doseMcg]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-fg">Tools</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Reconstitution math only. Example numbers are not a dose, a protocol, or a suggestion to use anything.
        </p>
      </header>

      <EducationalNotice compact />

      <section className="rounded-2xl bg-bg-elevated p-5 ring-1 ring-border">
        <h2 className="text-xs font-medium tracking-widest text-subtle uppercase">Reconstitution</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Concentration is vial mass divided by diluent volume. Units assume a U-100 syringe, where 100 units is 1 mL.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => {
            const selected = vialMg === example.vial && waterMl === example.water && doseMcg === example.dose;
            return (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setVialMg(example.vial);
                  setWaterMl(example.water);
                  setDoseMcg(example.dose);
                }}
                className={cn(
                  "h-11 rounded-lg px-3 text-sm",
                  selected ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg",
                )}
              >
                {example.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Vial (mg)</span>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              value={vialMg}
              onChange={(event) => setVialMg(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Diluent (mL)</span>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              value={waterMl}
              onChange={(event) => setWaterMl(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Example amount (mcg)</span>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              value={doseMcg}
              onChange={(event) => setDoseMcg(event.target.value)}
            />
          </label>
        </div>

        {result ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Concentration" value={`${result.concentration.toFixed(0)} mcg/mL`} />
            <Stat label="Volume" value={`${result.drawMl.toFixed(3)} mL`} />
            <Stat label="U-100 units" value={result.drawUnits.toFixed(1)} />
            <Stat label="Draws in the vial" value={result.draws.toFixed(1)} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Enter positive numbers.</p>
        )}

        {result && result.drawMl > 1 && (
          <p className="mt-3 text-sm text-warn">That volume is more than 1 mL, so it does not fit one U-100 syringe.</p>
        )}
      </section>

      <ShopReferral />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-3">
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-1 text-lg text-accent-soft tabular-nums">{value}</p>
    </div>
  );
}
