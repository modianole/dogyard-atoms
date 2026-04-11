/**
 * generate-shalter-sql.mjs
 * Reads shalter-cache.json and writes shalter-insert.sql
 * ready to paste in Supabase SQL Editor (bypasses RLS).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir  = dirname(fileURLToPath(import.meta.url));
const cache  = JSON.parse(readFileSync(join(__dir, "shalter-cache.json"), "utf8"));

const esc  = (s) => s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`;
const num  = (n) => (n == null || isNaN(Number(n))) ? "0" : String(Number(n));

const inferType = (q = "", types = []) => {
  const h = `${q} ${types.join(" ")}`.toLowerCase();
  if (h.includes("מקלט") || h.includes("shelter")) return "public_shelter";
  if (h.includes("ממ")   || h.includes("mamad"))    return "mamad";
  return "protected_space";
};

const rows = cache.map(r =>
  `(${[
    esc(r.googlePlaceId),
    esc(r.name),
    esc(r.nameEn),
    esc(r.location),
    esc(r.locationEn),
    num(r.lat),
    num(r.lng),
    esc(inferType(r.matchedQuery, r.googleTypes)),
    num(r.rating),
    num(r.reviewsCount),
  ].join(",")})`
).join(",\n");

const sql = `-- ============================================================
-- shalter: INSERT ${cache.length} rows (generated ${new Date().toISOString()})
-- Paste in: Supabase Dashboard → SQL Editor
-- ============================================================

INSERT INTO public.shalter
  (google_place_id, name, name_en, location, location_en,
   lat, lng, type, rating, reviews_count)
VALUES
${rows}
ON CONFLICT (google_place_id) DO UPDATE SET
  name          = EXCLUDED.name,
  name_en       = EXCLUDED.name_en,
  location      = EXCLUDED.location,
  location_en   = EXCLUDED.location_en,
  lat           = EXCLUDED.lat,
  lng           = EXCLUDED.lng,
  type          = EXCLUDED.type,
  rating        = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  updated_at    = now();

SELECT type, count(*) FROM public.shalter GROUP BY type ORDER BY type;
SELECT count(*) AS total FROM public.shalter;
`;

const outPath = join(__dir, "shalter-insert.sql");
writeFileSync(outPath, sql, "utf8");
const kb = Math.round(sql.length / 1024);
console.log(`✅ Generated: scripts/shalter-insert.sql (${cache.length} rows, ${kb} KB)`);
console.log("📋 Paste the file in Supabase SQL Editor and Run.");

