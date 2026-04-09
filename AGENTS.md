# AGENTS.md

## Project Snapshot
- `dogyard-atoms` is a Vite + React + TypeScript client app wrapped with Capacitor for Android (`src/`, `android/`).
- Backend is Supabase (Auth, Postgres, RLS, RPC) with schema history in `supabase/migrations/`.
- Core user flow is map/list/detail of dog gardens; admin flow imports Google Places data into Supabase.

## Architecture You Need First
- App shell and providers are in `src/App.tsx`: React Query, theme, language/RTL, toasts, router, and guarded routes.
- Routing is flat in `src/App.tsx`; protected pages use `src/components/ProtectedRoute.tsx` + `src/hooks/useAuth.ts`.
- Data access is direct from UI/hooks to Supabase (`src/integrations/supabase/client.ts`, `src/hooks/useGardens.ts`, `src/pages/Map.tsx`).
- Mobile deep-link auth handling lives in `src/App.tsx` via Capacitor `appUrlOpen` and Supabase `setSession`.
- Bilingual UX is centralized in `src/context/LanguageContext.tsx` + `src/i18n/translations.ts` (default Hebrew + RTL).

## Important Domain Patterns
- Garden names are normalized before display; reuse `formatGardenName` from `src/hooks/useGardens.ts`.
- Admin import (`src/pages/AdminImport.tsx`) scans Google Places by sectors/queries, enriches EN text, then `upsert`s by `google_place_id`.
- Admin access is deny-by-default unless strict env config exists (`VITE_ADMIN_USER_ID` / `VITE_ADMIN_EMAIL`) in `src/hooks/useDeveloperAccess.ts`.
- Supabase schema uses RLS heavily; policies/functions in migrations are part of app behavior, not just DB setup.

## Developer Workflows (Repo-Accurate)
- Install deps: `npm install --legacy-peer-deps` (documented in `README.md`).
- Web dev: `npm run dev` (host/port from `VITE_DEV_HOST`/`VITE_DEV_PORT`, see `vite.config.ts`).
- Tests: `npm test` (Vitest jsdom, setup in `vitest.config.ts` and `src/test/setup.ts`).
- Build web: `npm run build`.
- Android sync/run: `npx cap sync android`, `npx cap open android`, or `npm run play`.
- Docker local image/runtime: `compose.yaml`, `Dockerfile`, and reset helper `scripts/docker-reset-and-run.ps1`.

## Conventions Used In This Codebase
- Use `@/` path aliases (configured in `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`).
- UI components follow shadcn-style structure under `src/components/ui/` (see `components.json`).
- TypeScript strictness is intentionally relaxed (`noImplicitAny: false`, `strictNullChecks: false`), so add explicit runtime checks on critical paths.
- ESLint allows unused TS vars currently (`@typescript-eslint/no-unused-vars: off`); do not rely on lint to catch dead code.

## Integrations and Config Surface
- Required client envs typically include: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`), `VITE_GOOGLE_MAPS_API_KEY`.
- Capacitor dev-server bridging uses `CAPACITOR_ANDROID_SERVER_URL` in `capacitor.config.ts`.
- Android release signing values are resolved from env or `android/local.properties` in `android/app/build.gradle`.
- Firebase Crashlytics/Analytics are wired in Android Gradle (`android/app/build.gradle`, `android/app/google-services.json`).

## Safe Change Guardrails For Agents
- When changing DB-facing features, inspect related SQL migration history before editing TS usage.
- Preserve bilingual/RTL behavior when touching navigation, layout, or labels.
- For auth/deep-link changes, test both browser callback route (`/auth/callback`) and Capacitor `appUrlOpen` flow.
- For map/admin import changes, verify `google_place_id` conflict handling is preserved to avoid duplicates.

