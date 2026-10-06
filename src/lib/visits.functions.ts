import { createServerFn } from "@tanstack/react-start";

export const recordVisit = createServerFn({ method: "POST" }).handler(async (): Promise<number> => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ visits: number }>(
    `insert into site_stats (id, visits) values (1, 1)
     on conflict (id) do update set visits = site_stats.visits + 1
     returning visits`,
  );
  return Number(rows[0]?.visits ?? 0);
});
