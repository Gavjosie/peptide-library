import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShopReferral } from "@/components/referral";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
  head: () => ({ meta: [{ title: "Tools · Peptide Library" }] }),
});

function ToolsPage() {
  const [vialMg, setVialMg] = useState("5");
  const [waterMl, setWaterMl] = useState("2");
  const [doseMcg, setDoseMcg] = useState("250");

  const result = useMemo(() => {
    const mg = parseFloat(vialMg);
    const ml = parseFloat(waterMl);
    const mcg = parseFloat(doseMcg);
    if (!mg || !ml || !mcg || mg <= 0 || ml <= 0 || mcg <= 0) return null;
    const concentrationMcgPerMl = (mg * 1000) / ml;
    const drawMl = mcg / concentrationMcgPerMl;
    const drawUnits = drawMl * 100;
    return {
      concentration: concentrationMcgPerMl,
      drawMl,
      drawUnits,
    };
  }, [vialMg, waterMl, doseMcg]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight text-fg">Tools</h1>
        <p className="mt-1 text-sm text-muted">
          Reconstitution calculator · educational math only
        </p>
      </header>

      <section className="rounded-2xl bg-bg-elevated p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">
          Reconstitution
        </h2>
        <p className="mt-1 text-sm text-muted">
          Enter vial size, BAC water, and desired dose. Assumes U-100 insulin syringe
          (100 units = 1 mL).
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Vial (mg)</span>
            <Input
              type="number"
              inputMode="decimal"
              value={vialMg}
              onChange={(e) => setVialMg(e.target.value)}
              className="h-11"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">BAC water (mL)</span>
            <Input
              type="number"
              inputMode="decimal"
              value={waterMl}
              onChange={(e) => setWaterMl(e.target.value)}
              className="h-11"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Desired dose (mcg)</span>
            <Input
              type="number"
              inputMode="decimal"
              value={doseMcg}
              onChange={(e) => setDoseMcg(e.target.value)}
              className="h-11"
            />
          </label>
        </div>

        {result ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface px-4 py-3">
              <p className="text-xs text-subtle">Concentration</p>
              <p className="mt-1 font-mono text-lg text-accent-soft">
                {result.concentration.toFixed(0)} mcg/mL
              </p>
            </div>
            <div className="rounded-xl bg-surface px-4 py-3">
              <p className="text-xs text-subtle">Draw volume</p>
              <p className="mt-1 font-mono text-lg text-accent-soft">
                {result.drawMl.toFixed(3)} mL
              </p>
            </div>
            <div className="rounded-xl bg-surface px-4 py-3">
              <p className="text-xs text-subtle">Units (U-100)</p>
              <p className="mt-1 font-mono text-lg text-accent-soft">
                {result.drawUnits.toFixed(1)} units
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Enter valid positive numbers.</p>
        )}
      </section>

      <ShopReferral />
    </div>
  );
}
