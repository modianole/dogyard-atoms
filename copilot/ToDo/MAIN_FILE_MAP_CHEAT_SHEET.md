# MAIN File Map Cheat Sheet

סקופ המסמך: זרימות MAIN בלבד.

> מסמך זה לא מכסה כרגע פיצ'רים של מקלטים / `protected_spaces` / `shalter`.

## 1) Auth / Routing / Guards

- מעטפת אפליקציה ו-routes: `src/App.tsx`
- הגנה על routes: `src/components/ProtectedRoute.tsx`
- ניהול session + auth state: `src/hooks/useAuth.ts`
- מסך התחברות/הרשמה/OAuth: `src/pages/Auth.tsx`
- callback ל-web OAuth: `src/pages/AuthCallback.tsx`
- לקוח Supabase: `src/integrations/supabase/client.ts`

## 2) Map / Gardens / Check-in

- שליפת גינות + nearby RPC: `src/hooks/useGardens.ts`
- נירמול שם גינה (חובה בתצוגה): `formatGardenName` בתוך `src/hooks/useGardens.ts`
- מפה + markers + רשימה: `src/pages/Map.tsx`
- פרטי גינה + check-in: `src/pages/GardenDetails.tsx`

## 3) Admin Import / Moderation

- אדמין import מגוגל + upsert: `src/pages/AdminImport.tsx`
- אדמין ניהול סטטוס גינות: `src/pages/AdminGardens.tsx`
- גישת אדמין deny-by-default: `src/hooks/useDeveloperAccess.ts`

## 4) Dogs / Profile / Sharing

- פרופיל משתמש + כלבים: `src/pages/Profile.tsx`
- קבלת שיתוף כלב: `src/pages/DogShareAccept.tsx`
- RPC שיתוף (DB מקור אמת): `supabase/migrations/20260408021000_dog_profile_sharing_mvp.sql`

## 5) i18n / RTL

- state שפה + `dir=rtl`: `src/context/LanguageContext.tsx`
- מילון תרגומים he/en: `src/i18n/translations.ts`

## 6) DB / RLS / Types

- היסטוריית סכימה ומדיניות: `supabase/migrations/`
- טיפוסי Supabase בצד קליינט: `src/integrations/supabase/types.ts`
- nearby RPC + spatial: `supabase/migrations/20260316000000_add_spatial_support_and_nearby_function.sql`
- unique/partial indexes ל-`google_place_id`: `supabase/migrations/20260408102000_add_google_place_ids.sql`

## 7) Android / Capacitor

- קונפיג Capacitor: `capacitor.config.ts`
- קונפיג אנדרואיד (חתימה/Crashlytics/Analytics): `android/app/build.gradle`

## Invariants ל-MAIN

- תמיד להציג שמות גינות דרך `formatGardenName`.
- ב-import לשמור `upsert` לפי `google_place_id`.
- בשינויי auth לבדוק גם web callback וגם deep-link native.
- בשינויי DB לעבור קודם על migrations ולא רק על TS.

