/**
 * import-protected-spaces.mjs
 *
 * Replicates the AdminImport "Protected Spaces" terminal logic as a Node.js script.
 * Scans Google Places for ממ"ד / מקלטים / מרחבים מוגנים and upserts to Supabase.
 *
 * Usage:
 *   node scripts/import-protected-spaces.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync, existsSync } from "fs";

const CACHE_FILE = new URL("./shalter-cache.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const IMPORT_ONLY = process.argv.includes("--import-only");

// ── Config (matches .env) ─────────────────────────────────────────────────────
const SUPABASE_URL        = "https://keccmcwkqguooifloxnt.supabase.co";
const SUPABASE_ANON_KEY   = "sb_publishable_SIw07T3_yCfhT30kfwnLHg_UGfotr8c";
const GOOGLE_MAPS_API_KEY = "AIzaSyCTQVFIJDjUTTFKJVGExsirzpYENJ4xGSk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Sectors (identical to AdminImport.tsx) ────────────────────────────────────
const SECTORS = [
  { name: "תל אביב - מרכז",  lat: 32.076,  lng: 34.775  },
  { name: "תל אביב - צפון",  lat: 32.11,   lng: 34.79   },
  { name: "תל אביב - דרום",  lat: 32.05,   lng: 34.765  },
  { name: "תל אביב - מזרח",  lat: 32.085,  lng: 34.815  },
  { name: "רמת גן",           lat: 32.062,  lng: 34.825  },
  { name: "גבעתיים",          lat: 32.068,  lng: 34.812  },
  { name: "הרצליה",           lat: 32.1656, lng: 34.8308 },
];

const QUERIES = [
  'ממ"ד',
  "מרחב מוגן",
  "מקלט ציבורי",
  "public shelter",
  "bomb shelter",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isMostlyLatin = (v) => !!v && /[A-Za-z]/.test(v);

const inferType = (matchedQuery, googleTypes = []) => {
  const h = `${matchedQuery} ${googleTypes.join(" ")}`.toLowerCase();
  if (h.includes("ממ") || h.includes("safe_room")) return "mamad";
  if (h.includes("מקלט") || h.includes("shelter"))  return "public_shelter";
  return "protected_space";
};

const fallbackId = (name, lat, lng) =>
  `fallback:${(name || "unknown").trim().toLowerCase()}:${lat.toFixed(6)}:${lng.toFixed(6)}`;

// ── Google Places Text Search (REST) ─────────────────────────────────────────
async function textSearch(query, lat, lng) {
  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json` +
    `?query=${encodeURIComponent(query)}` +
    `&location=${lat},${lng}` +
    `&radius=1500` +
    `&key=${GOOGLE_MAPS_API_KEY}`;

  const res  = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.warn(`  ⚠️  Places API status: ${data.status}`);
  }

  return data.results || [];
}

// ── Places API (New) – English enrichment ────────────────────────────────────
async function fetchEnglish(placeId) {
  if (!placeId || placeId.startsWith("fallback:")) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key":  GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "displayName,formattedAddress",
        },
      }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      nameEn:     d.displayName?.text || null,
      locationEn: d.formattedAddress  || null,
    };
  } catch {
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🛡️  ממ\"ד / מרחבים מוגנים — Import to Supabase [table: shalter]");
  console.log("=".repeat(60));

  let enriched;

  // ── Load from cache or run full scan ────────────────────────────────────────
  if (IMPORT_ONLY) {
    if (!existsSync(CACHE_FILE)) {
      console.error("❌ Cache file not found. Run without --import-only first.");
      process.exit(1);
    }
    enriched = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    console.log(`📦 Loaded ${enriched.length} records from cache (${CACHE_FILE})`);
  } else {
    const collected = new Map();

    // Step 1: Scan
    for (const sector of SECTORS) {
      for (const query of QUERIES) {
        process.stdout.write(`  📍 ${sector.name} • ${query} … `);

        const results = await textSearch(query, sector.lat, sector.lng);
        let added = 0;

        for (const place of results) {
          const lat          = place.geometry?.location?.lat ?? 0;
          const lng          = place.geometry?.location?.lng ?? 0;
          const address      = place.formatted_address || place.vicinity || sector.name;
          const googlePlaceId = place.place_id || fallbackId(place.name, lat, lng);

          if (!collected.has(googlePlaceId)) {
            collected.set(googlePlaceId, {
              googlePlaceId,
              name:         place.name || query,
              nameEn:       isMostlyLatin(place.name) ? place.name : null,
              location:     address,
              locationEn:   isMostlyLatin(address)    ? address    : null,
              lat,
              lng,
              rating:       place.rating              ?? null,
              reviewsCount: place.user_ratings_total  ?? null,
              matchedQuery: query,
              googleTypes:  place.types               || [],
            });
            added++;
          }
        }

        console.log(`${results.length} results (${added} new)`);
        await sleep(300);
      }
    }

    const baseResults = Array.from(collected.values());
    console.log(`\n✅ Scan done: ${baseResults.length} unique places`);

    // Step 2: Enrich with English
    console.log("🌐 Fetching English names & addresses …");
    enriched = await Promise.all(
      baseResults.map(async (r) => {
        const en = await fetchEnglish(r.googlePlaceId);
        return {
          ...r,
          nameEn:     en?.nameEn     || r.nameEn,
          locationEn: en?.locationEn || r.locationEn,
        };
      })
    );

    // Save cache
    writeFileSync(CACHE_FILE, JSON.stringify(enriched, null, 2), "utf8");
    console.log(`💾 Saved to cache: ${CACHE_FILE}`);
  }

  // Step 3: Upsert to Supabase → shalter table
  console.log(`\n⬆️  Upserting ${enriched.length} records to shalter …`);

  const payload = enriched.map((r) => ({
    google_place_id: r.googlePlaceId,
    name:            r.name,
    name_en:         r.nameEn,
    location:        r.location,
    location_en:     r.locationEn,
    lat:             r.lat,
    lng:             r.lng,
    rating:          r.rating        ?? 0,
    reviews_count:   r.reviewsCount  ?? 0,
    type:            inferType(r.matchedQuery, r.googleTypes),
  }));

  const { error } = await supabase
    .from("shalter")
    .upsert(payload, { onConflict: "google_place_id" });

  if (error) {
    console.error("\n❌ Upsert failed:", error.message);
    console.log("\n📋 לא שכחת ליצור את הטבלה? הרץ את ה-SQL הזה ב-Supabase Dashboard:");
    console.log("   https://supabase.com/dashboard/project/keccmcwkqguooifloxnt/sql");
    console.log("   קובץ: scripts/create-shalter-table.sql");
    console.log("\n   לאחר יצירת הטבלה, הרץ:");
    console.log("   node scripts/import-protected-spaces.mjs --import-only\n");
    process.exit(1);
  }

  // Summary
  const byType = {};
  for (const r of payload) byType[r.type] = (byType[r.type] || 0) + 1;

  console.log("\n🎉 Import complete!");
  console.log("─".repeat(35));
  for (const [type, count] of Object.entries(byType)) {
    const icon = type === "mamad" ? "🏠" : type === "public_shelter" ? "🏛️" : "🛡️";
    console.log(`  ${icon} ${type}: ${count}`);
  }
  console.log(`  📦 Total: ${payload.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

