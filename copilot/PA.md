# PA - Project Architecture Handoff (dogyard-atoms)

מסמך זה נועד לאפשר לסוכן הבא להתחיל לעבוד מיד, בלי סריקה מחדש של הריפו.

## 1) מה הפרויקט הזה

- לקוח: `Vite + React + TypeScript` בתוך `src/`.
- מובייל: עטיפה עם `Capacitor` לאנדרואיד (`android/`).
- Backend: `Supabase` (Auth, Postgres, RLS, RPC, Views, Storage) עם היסטוריית סכימה ב-`supabase/migrations/`.
- דומיין מרכזי: גינות כלבים (מפה, פרטי גינה, צ'ק-אין, פרופיל כלבים, שיתוף פרופיל כלב), + אדמין לייבוא נתונים מ-Google Places.
- תוספת דומיין: ניווט למרחב מוגן קרוב (נשען כרגע על טבלת `shalter`).

---

## 2) נקודות כניסה וזרימת Runtime

### Frontend boot

- `src/main.tsx`:
  - מרנדר את `<App />`.
  - יש הערה מפורשת שהוסרה לוגיקת service-worker clearing בגלל שגיאות Capacitor.

### App shell

- `src/App.tsx`:
  - עוטף Providers: `QueryClientProvider` -> `ThemeProvider` -> `LanguageProvider` -> `TooltipProvider` -> toasters.
  - Router: `BrowserRouter` עם routes שטוחים.
  - Layout global: `Navbar`, `BottomNav`, `Footer` (מותנה לעמוד map).
  - Deep-link auth למובייל (`CapacitorApp.addListener('appUrlOpen')`):
    - אם URL מתאים ל-auth/reset, סוגר browser (`Browser.close()`), מחלץ tokens מה-hash/search, קורא `supabase.auth.setSession`, ומבצע redirect.

### Routing map (מקור אמת: `src/App.tsx`)

- Public:
  - `/` -> `Index`
  - `/map` -> `Map`
  - `/auth` -> `Auth`
  - `/auth/callback` -> `AuthCallback`
  - `/reset-password` -> `ResetPassword`
  - `/privacy` -> `Privacy`
  - `/terms` -> `Terms`
  - `/dog-share/accept` -> `DogShareAccept`
  - `/garden/:id` -> `GardenDetails`
  - `/admin/import` -> `AdminImport`
  - `/admin/gardens` -> `AdminGardens`
- Protected via `ProtectedRoute`:
  - `/profile`, `/settings`

---

## 3) Auth והרשאות

### Auth client flow

- `src/hooks/useAuth.ts`:
  - מאזין ל-`onAuthStateChange` + מבצע `getSession` לאימות מצב נוכחי.
  - במקרה session שבור: signOut + ניקוי state.
- `src/components/ProtectedRoute.tsx`:
  - אם `loading`: spinner fullscreen.
  - אם אין משתמש: redirect ל-`/auth`.

### Email + Google auth

- `src/pages/Auth.tsx`:
  - Email/password sign-in/sign-up + forgot-password.
  - Google OAuth:
    - Web: `redirectTo = window.location.origin`.
    - Native: `redirectTo = com.dogyard.app://auth-callback` + `skipBrowserRedirect` + פתיחה ידנית של Browser.

### OAuth callback

- `src/pages/AuthCallback.tsx`:
  - קורא query param `code`, מבצע `exchangeCodeForSession`.
  - משתמש ב-`auth:next` מ-`sessionStorage` לצורך החזרה ליעד המקורי.

### Admin access (deny by default)

- `src/hooks/useDeveloperAccess.ts`:
  - גישה ניתנת רק אם יש קונפיג מפורש דרך `VITE_ADMIN_USER_ID` או `VITE_ADMIN_EMAIL` (עם תאימות legacy envs).
  - אם אין קונפיג: חסום כברירת מחדל גם למשתמש מחובר.

---

## 4) שכבת דאטה (Frontend -> Supabase)

### Supabase client

- `src/integrations/supabase/client.ts`:
  - URL ו-key מהסביבה (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_ANON_KEY`).
  - PKCE flow + persist session + auto refresh.

### Typed schema

- `src/integrations/supabase/types.ts`:
  - טיפוסים גנרטיביים לטבלאות/Views/Functions/Enums.
  - Includes: `gardens`, `dogs`, `check_ins`, `protected_spaces`, `dog_profile_members`, `dog_share_invites`, וכו'.

### דפוס שימוש

- אין backend middleware פנימי; רוב הקריאות הן ישירות מה-pages/hooks ל-Supabase.

---

## 5) מודולים דומייניים חשובים

### גינות כלבים (core)

- `src/hooks/useGardens.ts`:
  - `useGardens` שולף `gardens`.
  - `useNearbyGardens` קורא RPC `get_nearby_gardens`.
  - פונקציה קריטית: `formatGardenName` (נירמול שם בעברית/אנגלית לפני הצגה).
- `src/pages/Map.tsx`:
  - Google Maps rendering עם `@vis.gl/react-google-maps`.
  - שולף גינות ישירות מטבלת `gardens`, מציג רשימה + markers.
- `src/pages/GardenDetails.tsx`:
  - שולף גינה לפי id.
  - מציג active visitors מתוך view `active_garden_visitors`.
  - צ'ק-אין: insert לטבלת `check_ins` עם dog(s), status (`arrived`/`on_way`) ותוקף שעה.

### פרופיל וכלבים + שיתוף

- `src/pages/Profile.tsx`:
  - מנהל פרופיל משתמש (`profiles`) וכלבים (`dogs`).
  - תומך במיזוג כלבים שבבעלות המשתמש + כלבים משותפים אליו דרך `dog_profile_members`.
  - יצירת קישור שיתוף ע"י RPC `create_dog_share_invite`.
- `src/pages/DogShareAccept.tsx`:
  - מקבל `token` מה-URL.
  - אם לא מחובר -> מפנה ל-`/auth?next=...`.
  - אם מחובר -> RPC `accept_dog_share_invite`.

### אדמין import

- `src/pages/AdminImport.tsx`:
  - 2 מצבי סריקה: `dog_gardens` ו-`protected_spaces`.
  - סריקת Google Places לפי sectors + queries מוגדרים בקוד.
  - enrichment באנגלית דרך Places API v1.
  - import עם `upsert` לפי `google_place_id` כדי למנוע כפילויות.
- `src/pages/AdminGardens.tsx`:
  - ניהול gardens שאינם `approved` + עדכון status.

### ניווט למרחב מוגן

- `src/hooks/useNearestShalter.ts`:
  - שולף נתונים מטבלת `shalter` (שם הטבלה כתוב כך בקוד).
  - מחשב nearest לפי Haversine.
  - פותח ניווט Google Maps.
  - Native path משתמש ב-plugin `LocationAccuracy` (`src/plugins/locationAccuracy.ts`) להצגת dialog של Google Location settings.
- `src/components/ProtectedSpacePromptDialog.tsx`:
  - fallback כש-GPS כבוי: כתובת ידנית / בחירת גינה כנקודת מוצא.

---

## 6) בינלאומיות, RTL ו-UX

- `src/context/LanguageContext.tsx`:
  - ברירת מחדל עברית (`he`) + `dir=rtl`.
  - מתמיד שפה ב-`localStorage` ומעדכן `documentElement.lang/dir`.
- `src/i18n/translations.ts`:
  - אובייקט translations מלא (he/en) עבור רוב ה-UI.
- בפועל קיימים גם טקסטים hardcoded בחלק מהעמודים (למשל admin/profile/settings).

---

## 7) סכימת DB ומיגרציות (Supabase)

מקור אמת: `supabase/migrations/*.sql`

### בסיס (20260315175015...)

יוצר:

- Enums: `app_role`, `order_status`, `hazard_status`.
- פונקציות/טריגרים: `update_updated_at_column`, `handle_new_user`, `has_role`, `update_garden_rating`.
- טבלאות ליבה: `user_roles`, `profiles`, `gardens`, `restaurants`, `menu_items`, `deals`, `orders`, `hazard_reports`, `reviews`, `peak_hours`.
- Storage buckets policies (`garden-images`, `menu-images`, `hazard-images`, `user-avatars`).
- RLS כמעט לכל טבלה.

### Spatial + check-ins (20260316000000)

- `postgis` + עמודת `geom` ל-`gardens` + GIST index.
- יוצר טבלת `check_ins`.
- RPC `get_nearby_gardens(user_lat, user_lng, radius_meters)`.

### Check-in logic extension (20260316100000)

- Enum `check_in_status` + status בעמודת `check_ins`.
- View `active_garden_visitors` (ממיר `on_way` ל-`arrived` לפי זמן).

### Gardens policy cleanup (20260318234137...)

- מסנכרן policies ל-`gardens`.

### Dogs table (20260319000000)

- Enums: `dog_size`, `dog_gender`.
- טבלת `dogs` + RLS.
- bucket `dog-images` + policies.

### Dog profile sharing MVP (20260408021000)

- Enum `dog_share_role`.
- טבלאות: `dog_profile_members`, `dog_share_invites`.
- טריגר `sync_dog_owner_membership` לשמירת owner-membership.
- RPCs: `create_dog_share_invite`, `accept_dog_share_invite`.

### Protected spaces + import support (2026040810...)

- `protected_spaces` table + RLS + indexes.
- `gardens.status` + indexes.
- `google_place_id` על `gardens` ו-`protected_spaces` + unique partial indexes.

---

## 8) Android/Capacitor/Native

- `capacitor.config.ts`:
  - `appId = com.dogyard.app`, `webDir = dist`.
  - בזמן פיתוח ניתן להגדיר `CAPACITOR_ANDROID_SERVER_URL` (כולל cleartext detection).
- `android/app/build.gradle`:
  - Firebase Crashlytics + Analytics.
  - חתימה ל-release דרך env או `android/local.properties`.
  - fallback ל-debug signing אם חסר release signing.
  - כולל תלויות `play-services-location` עבור dialog/location settings.

---

## 9) Build/Test/Tooling

- `package.json` scripts:
  - `npm run dev`, `npm run build`, `npm test`, `npm run play`.
- Alias `@/` מוגדר ב-`vite.config.ts`, `vitest.config.ts`, `tsconfig.json`.
- TypeScript relaxed (`noImplicitAny: false`, `strictNullChecks: false`).
- ESLint: `@typescript-eslint/no-unused-vars` כבוי.
- Tests:
  - Vitest + jsdom + `src/test/setup.ts`.
  - קיימים מעט טסטים (`src/test/legal-pages.test.tsx`, `src/test/example.test.ts`).
- E2E:
  - `playwright.config.ts` קיים אבל כרגע בסיסי מאוד (template).

---

## 10) תשתית Docker/Deploy

- `Dockerfile`: multi-stage (Node build -> Nginx runtime), inject של VITE public env vars בשלב build.
- `nginx.conf`: SPA fallback ל-`/index.html` + headers קשיחים.
- `compose.yaml` ו-`Dockerfile` נראים כרגע עם שורות חריגות/לא עקביות בתחילת הקובץ (דורש בדיקה לפני הסתמכות מלאה על docker local runtime).
- script עזר: `scripts/docker-reset-and-run.ps1`.

---

## 11) משתני סביבה חשובים

- חובה/נפוצים:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` (או `VITE_SUPABASE_ANON_KEY`)
  - `VITE_GOOGLE_MAPS_API_KEY`
- אדמין:
  - `VITE_ADMIN_USER_ID`
  - `VITE_ADMIN_EMAIL`
- פיתוח רשת:
  - `VITE_DEV_HOST`
  - `VITE_DEV_PORT`
- Capacitor Android dev bridge:
  - `CAPACITOR_ANDROID_SERVER_URL`

---

## 12) חוזים/אינווריאנטים חשובים לשימור

- תמיד להשתמש ב-`formatGardenName` בהצגת שמות גינות.
- ב-admin import לשמור `upsert` לפי `google_place_id` כדי למנוע כפילויות.
- לשינויים ב-auth/deeplink לבדוק גם:
  - `/auth/callback` (web)
  - `appUrlOpen` (native)
- לשינויים בניווט מרחב מוגן:
  - לוודא תאימות לשם הטבלה `shalter` כפי שמשומש כרגע בקוד.
- לשינויים בדאטה מול Supabase:
  - לבדוק קודם את היסטוריית migration + RLS policies.

---

## 13) Known Gaps / סיכונים קיימים

- קיימת כתיבה עקבית של `Shalter` (ולא `Shelter`) בקוד; יש להיזהר בשמות טבלאות/Hookים.
- קיימות אינדיקציות לפער בין טבלת `protected_spaces` לבין זרימת nearest-shelter שנשענת על `shalter`.
- קבצי Docker/Compose תוקנו תחבירית בריצה האחרונה, אך עדיין נדרש אימות ריצה מלא (`docker compose config`, `docker build`) בסשן נקי.
- כיסוי טסטים נמוך ביחס לרוחב המערכת.

---

## 14) איפה להתחיל אם צריך לשנות פיצ'ר

- Routing / guards / providers -> `src/App.tsx`, `src/components/ProtectedRoute.tsx`, `src/hooks/useAuth.ts`.
- i18n/RTL -> `src/context/LanguageContext.tsx`, `src/i18n/translations.ts`.
- Gardens map/list/details -> `src/pages/Map.tsx`, `src/pages/GardenDetails.tsx`, `src/hooks/useGardens.ts`.
- Admin import -> `src/pages/AdminImport.tsx`, ואז migrations של `google_place_id` ו-`protected_spaces`.
- Dog profile sharing -> `src/pages/Profile.tsx`, `src/pages/DogShareAccept.tsx`, migration `20260408021000_dog_profile_sharing_mvp.sql`.
- DB behavior/RLS -> `supabase/migrations/*` + `src/integrations/supabase/types.ts`.

---

## 15) פקודות עבודה בסיסיות

```powershell
npm install --legacy-peer-deps
npm run dev
npm test
npm run build
npx cap sync android
```

מסמך זה משקף את מצב הקוד שנבדק בפועל בקבצי המקור לעיל.
