# מפרט טכני לפרונטאנד — `dogyard-atoms`

## Stack

- `React 18`
- `TypeScript`
- `Vite 5`
- `react-router-dom`
- `@tanstack/react-query`
- `@supabase/supabase-js`
- `Tailwind CSS`
- `Radix UI`
- `shadcn-style` תחת `src/components/ui/`
- `@vis.gl/react-google-maps`
- `Capacitor`
- `Vitest` + `Testing Library` + `jsdom`

## Core runtime

- entry: `src/main.tsx`
- app shell + routes: `src/App.tsx`
- providers: `QueryClientProvider` → `ThemeProvider` → `LanguageProvider` → `TooltipProvider` → toasters → `BrowserRouter`
- guard: `src/components/ProtectedRoute.tsx`

## תיקיות

- `components/`
- `components/ui/`
- `pages/`
- `hooks/`
- `context/`
- `i18n/`
- `integrations/`
- `lib/`
- `test/`

## Alias

- `@/` → `src/`
- מוגדר ב־`tsconfig.json`, `vite.config.ts`, `vitest.config.ts`

## i18n / RTL

- מקור אמת: `src/context/LanguageContext.tsx`, `src/i18n/translations.ts`
- ברירת מחדל: `he`
- כיוון ברירת מחדל: `rtl`
- state נשמר ב־`localStorage` תחת `dogyard-language`

## Supabase

- client: `src/integrations/supabase/client.ts`
- env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, fallback `VITE_SUPABASE_ANON_KEY`
- auth: `persistSession`, `autoRefreshToken`, `detectSessionInUrl`, `flowType: 'pkce'`
- data access: ישירות מתוך `pages` ו־`hooks`
- auth state: `src/hooks/useAuth.ts`
- gardens: `src/hooks/useGardens.ts`

## UI

- base UI: `src/components/ui/`
- helper: `src/lib/utils.ts` → `cn(...)`
- variants: `src/components/ui/button.tsx` עם `cva`

## Testing

- config: `vitest.config.ts`
- setup: `src/test/setup.ts`
- pattern: `src/**/*.{test,spec}.{ts,tsx}`

## Constraints

- שמות גינות: להשתמש ב־`formatGardenName` מתוך `src/hooks/useGardens.ts`
- auth callback: web `/auth/callback`, native `com.dogyard.app://auth-callback`
- לשמור RTL כברירת מחדל בעברית
- admin import: לשמר `google_place_id`
- nearest shelter flow משתמש ב־`shalter`
- שינויי DB-facing: לבדוק גם `supabase/migrations/`
- לא ליצור מסמכי Markdown חדשים ב־root ללא הכרח



