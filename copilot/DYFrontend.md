# DYF - מפרט טכני Frontend מקוצר

## 1) מטרה והיקף
מסמך יחיד לצוות Frontend/UX-UI: לבנות ולשנות UI בלי לקרוא `copilot/PA.md`, תוך שמירה על חוזי מערכת, i18n/RTL, Auth, Supabase ו-RLS.

חל על:
- כל שינוי ב-`src/` (עמודים, קומפוננטות, ניווט, מצבי מסך).
- כל UI שקורא/כותב נתונים מול Supabase.

## 2) מקור אמת וקבצים קריטיים
- מעטפת/רוטינג/Deep link: `src/App.tsx`, `src/main.tsx`
- Auth/Guard: `src/hooks/useAuth.ts`, `src/components/ProtectedRoute.tsx`, `src/pages/Auth.tsx`, `src/pages/AuthCallback.tsx`
- i18n/RTL: `src/context/LanguageContext.tsx`, `src/i18n/translations.ts`
- דאטה: `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `supabase/migrations/*.sql`
- דומיין: `src/hooks/useGardens.ts`, `src/pages/Map.tsx`, `src/pages/GardenDetails.tsx`, `src/pages/Profile.tsx`, `src/pages/DogShareAccept.tsx`, `src/pages/AdminImport.tsx`, `src/pages/AdminGardens.tsx`, `src/hooks/useNearestShalter.ts`

## 3) חוזים מחייבים (Non-Negotiable)
- ברירת מחדל שפה: `he` + `dir=rtl`; כל טקסט חדש נכנס ל-`translations` (he/en), ללא hardcoded חדש.
- routes מנוהלים ב-`src/App.tsx`; מסכים מוגנים דרך `ProtectedRoute` בלבד (`/profile`, `/settings`).
- `ProtectedRoute`: מצב `loading` ברור; משתמש לא מחובר -> redirect ל-`/auth`.
- auth חייב לעבוד ב-2 מסלולים: `/auth/callback` (web) ו-`appUrlOpen` (native).
- Supabase הוא direct-from-frontend: כל שינוי UI דאטה דורש בדיקה מול `types.ts` + `migrations` + UX fallback ל-RLS/permissions.
- אינווריאנטים:
  - שמות גינות מוצגים רק דרך `formatGardenName`.
  - ב-Admin Import שומרים `upsert` לפי `google_place_id`.
  - nearest protected space נשען כרגע על `shalter` (כתיב קיים), לא משנים חוזה בלי תיאום DB+Frontend.
- גישת אדמין היא deny-by-default ללא `VITE_ADMIN_USER_ID`/`VITE_ADMIN_EMAIL` (`src/hooks/useDeveloperAccess.ts`).

## 4) Routing תפעולי (קצר)
- Public: `/`, `/map`, `/auth`, `/auth/callback`, `/reset-password`, `/privacy`, `/terms`, `/dog-share/accept`, `/garden/:id`, `/admin/import`, `/admin/gardens`
- Protected: `/profile`, `/settings`

## 5) Do / Don't (ליישום מהיר)
| תחום | DO | DON'T |
|---|---|---|
| i18n/RTL | להוסיף כל טקסט ל-`src/i18n/translations.ts` ולבדוק RTL/LTR | להכניס hardcoded strings או לבדוק רק בעברית |
| Routing/Auth | להוסיף מסכים דרך `src/App.tsx` ולשמור guard נכון | לעקוף `ProtectedRoute` או לשבור redirect ל-`/auth` |
| Deep Link | לבדוק שינויי auth גם ב-web callback וגם ב-`appUrlOpen` | להניח ש-flow דפדפן מכסה Android |
| Supabase/RLS | לבדוק חוזה ב-`types.ts` + `migrations` ולהציג fallback ברור | לשנות UI דאטה בלי לאמת הרשאות/Policies |
| Gardens | להשתמש ב-`formatGardenName` בכל תצוגת שם גינה | להציג שם גולמי מה-DB |
| Admin Import | לשמור `upsert` לפי `google_place_id` | לבצע insert עיוור שיוצר כפילויות |
| Protected Space | לשמור תאימות ל-`shalter` הקיים | "לתקן" ל-`shelter` בלי שינוי מתואם מלא |
| קונבנציות קוד | להשתמש ב-`@/` alias ובדפוס `src/components/ui/` | לערבב דפוסי מבנה/import לא עקביים |

## 6) Definition of Done (Frontend)
- [ ] אין hardcoded חדש; כל טקסט מתורגם he/en.
- [ ] המסך תקין ב-RTL וגם LTR.
- [ ] route/guard תקינים מול `src/App.tsx` ו-`ProtectedRoute`.
- [ ] auth נבדק ב-web + native deep-link.
- [ ] נשמרו `formatGardenName`, `google_place_id upsert`, `shalter` contract.
- [ ] קיימים מצבי `loading`/`empty`/`error`/`success` (+ לא מורשה אם רלוונטי).
- [ ] שינויי דאטה אומתו מול `types.ts` + `migrations`.

## 7) בדיקות מינימום ופקודות
```powershell
npm test
npm run build
```

לשינויים ב-auth/deeplink/native: להוסיף בדיקה ידנית ב-Android (Capacitor).

## 8) Env קריטי ל-Frontend
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (או `VITE_SUPABASE_ANON_KEY`)
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_ADMIN_USER_ID`
- `VITE_ADMIN_EMAIL`
- `VITE_DEV_HOST`, `VITE_DEV_PORT`
- `CAPACITOR_ANDROID_SERVER_URL`
