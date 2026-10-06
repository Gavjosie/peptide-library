import { useEffect, useRef, useState } from "react";
import { residueGroup } from "@/lib/peptides";

type ChainViewProps = {
  sequence: string;
  note?: string;
};

type Point = { x: number; y: number; z: number };

function helixPoints(sequence: string): Point[] {
  const rise = 1.5;
  const radius = 2.3;
  const turn = (100 * Math.PI) / 180;
  const raw = sequence.split("").map((letter, index) => {
    const angle = index * turn;
    return {
      x: Math.cos(angle) * radius,
      y: index * rise,
      z: Math.sin(angle) * radius,
    };
  });
  const mid = raw.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y, z: acc.z + point.z }),
    { x: 0, y: 0, z: 0 },
  );
  const n = raw.length || 1;
  return raw.map((point) => ({
    x: point.x - mid.x / n,
    y: point.y - mid.y / n,
    z: point.z - mid.z / n,
  }));
}

export function ChainView({ sequence, note }: ChainViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, y: 0, rotY: 0.5, rotX: 0.35, user: false });
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const points = helixPoints(sequence);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let stopped = false;

    const draw = () => {
      if (stopped) return;
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.max(1, Math.floor(width * dpr));
      const nextH = Math.max(1, Math.floor(height * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (!drag.current.user && !reduce) drag.current.rotY += 0.004;

      const { rotY, rotX } = drag.current;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const span = Math.max(...points.map((point) => Math.abs(point.y)), 1);
      const scale = Math.min(width, height) * 0.36 / (span + 2.4);

      const projected = points.map((point, index) => {
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.x * sinY + point.z * cosY;
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = point.y * sinX + z1 * cosX;
        const perspective = 6.5 / (6.5 + z2);
        return {
          index,
          x: width / 2 + x1 * scale * perspective,
          y: height / 2 - y2 * scale * perspective,
          z: z2,
          r: Math.max(4, 7 * perspective),
          letter: sequence[index] ?? "",
        };
      });

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(232,236,239,0.28)";
      ctx.beginPath();
      projected.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      const ordered = [...projected].sort((a, b) => a.z - b.z);
      for (const point of ordered) {
        const group = residueGroup(point.letter);
        const selected = point.index === activeRef.current;
        ctx.beginPath();
        ctx.fillStyle = group.color;
        ctx.arc(point.x, point.y, selected ? point.r + 3 : point.r, 0, Math.PI * 2);
        ctx.fill();
        if (selected) {
          ctx.fillStyle = "#061210";
          ctx.font = "600 12px Outfit, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(point.letter, point.x, point.y + 0.5);
        }
      }

      canvas.dataset.hits = JSON.stringify(
        projected.map((point) => ({ i: point.index, x: point.x, y: point.y, r: point.r + 4 })),
      );

      if (!reduce) frame = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      if (reduce) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [sequence]);

  function pick(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas?.dataset.hits) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const hits = JSON.parse(canvas.dataset.hits) as { i: number; x: number; y: number; r: number }[];
    const found = hits.find((hit) => (hit.x - x) ** 2 + (hit.y - y) ** 2 <= hit.r ** 2);
    if (found) setActive(found.i);
  }

  return (
    <div className="rounded-2xl bg-bg-elevated ring-1 ring-border">
      <div className="flex items-baseline justify-between gap-3 px-4 pt-4">
        <p className="text-xs font-medium tracking-widest text-subtle uppercase">Schematic chain</p>
        <p className="text-xs text-muted">
          {sequence[active]} · {active + 1}/{sequence.length}
        </p>
      </div>
      <div
        ref={wrapRef}
        className="relative h-72 touch-none"
        onPointerDown={(event) => {
          drag.current.active = true;
          drag.current.user = true;
          drag.current.x = event.clientX;
          drag.current.y = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current.active) return;
          const dx = event.clientX - drag.current.x;
          const dy = event.clientY - drag.current.y;
          drag.current.x = event.clientX;
          drag.current.y = event.clientY;
          drag.current.rotY += dx * 0.01;
          drag.current.rotX = Math.max(-1.2, Math.min(1.2, drag.current.rotX + dy * 0.01));
        }}
        onPointerUp={(event) => {
          drag.current.active = false;
          pick(event.clientX, event.clientY);
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full" role="img" aria-label={`Schematic helix of ${sequence}`} />
      </div>
      <p className="px-4 pb-2 text-xs leading-relaxed text-subtle">
        Alpha-helix sketch for orientation only — not an experimental structure. Drag to turn it.
        {note ? ` ${note}` : ""}
      </p>
      <div className="flex flex-wrap gap-1 px-4 pb-4">
        {sequence.split("").map((letter, index) => {
          const group = residueGroup(letter);
          return (
            <button
              key={`${letter}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`grid size-8 place-items-center rounded-md text-xs font-medium ${group.className} ${
                index === active ? "ring-2 ring-accent-soft" : ""
              }`}
              aria-label={`Residue ${index + 1} ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
