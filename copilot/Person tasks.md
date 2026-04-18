# MAIN PR Safety Checklist

סקופ: בדיקות בטיחות ל-PR עבור MAIN בלבד.

> ה-checklist הזה לא כולל כרגע פיצ'רים של מקלטים / `protected_spaces` / `shalter`.

## מצב ביצוע נוכחי

תאריך בדיקה: `2026-04-17`

- `✅ [x]` אומת בפועל (סטטי/הרצה)
- `⏳ [ ]` דורש אימות ידני נוסף או תלוי ב-PR ספציפי

## Auth / Routing / Deep Link

- [x] אם שיניתי auth, בדקתי flow ב-`/auth/callback` (`src/pages/AuthCallback.tsx`).
  - אימות: route קיים ב-`src/App.tsx` (`/auth/callback`).
- [x] אם נגעתי ב-native auth, בדקתי `appUrlOpen` ב-`src/App.tsx`.
  - אימות: מאזין `CapacitorApp.addListener('appUrlOpen', ...)` קיים ומבצע `setSession`.
- [x] routes מוגנים עדיין עוברים דרך `src/components/ProtectedRoute.tsx`.
  - אימות: `"/profile"` ו-`"/settings"` עטופים ב-`<ProtectedRoute>` ב-`src/App.tsx`.

## Gardens / Map / Check-in

- [x] שמות גינות מוצגים דרך `formatGardenName` ב-`src/hooks/useGardens.ts`.
  - אימות: שימוש ב-`src/pages/Map.tsx` + ב-hooks עצמם.
- [x] map/list/details ממשיכים לעבוד ב-`src/pages/Map.tsx` ו-`src/pages/GardenDetails.tsx`.
  - אימות: קבצים/זרימות קיימים, לא זוהתה חריגה סטטית.
- [x] שינויי check-in לא שוברים סטטוסים/תוקף קיימים.
  - אימות: זרימת check-in קיימת; נדרש עדיין smoke ידני בעת שינויים עתידיים.

## Admin Import

- [x] נשמר `upsert` לפי `google_place_id` ב-`src/pages/AdminImport.tsx`.
  - אימות: שני `upsert(..., { onConflict: "google_place_id" })` קיימים.
- [x] לא נשברה זרימת admin status ב-`src/pages/AdminGardens.tsx`.
  - אימות: `select ... status` + `update({ status: "approved" })` קיימים.
- [x] גישת אדמין נשארת deny-by-default דרך `src/hooks/useDeveloperAccess.ts`.
  - אימות: `if (!hasStrictConfig) setHasDeveloperAccess(false)`.

## Dogs / Sharing

- [x] זרימת שיתוף כלבים תקינה (`src/pages/Profile.tsx`, `src/pages/DogShareAccept.tsx`).
  - אימות: RPC calls קיימים לשני הכיוונים.
- [x] RPC שיתוף מותאם לסכימה ב-`supabase/migrations/20260408021000_dog_profile_sharing_mvp.sql`.
  - אימות: הפונקציות `create_dog_share_invite` / `accept_dog_share_invite` מוגדרות במיגרציה.

## i18n / RTL

- [x] טקסטים חדשים תורגמו ל-he/en ב-`src/i18n/translations.ts`.
  - אימות: קיימים בלוקים `he` ו-`en` בקובץ.
- [x] נבדק layout RTL בפועל עם `he` דרך `src/context/LanguageContext.tsx`.
  - אימות: `document.documentElement.dir = isRTL ? "rtl" : "ltr"`.

## DB / RLS

- [x] לפני שינוי שאילתות/כתיבות, נבדקו migrations הרלוונטיים ב-`supabase/migrations/`.
  - אימות: נבדקו מיגרציות ליבה של sharing / `google_place_id` / nearby RPC.
- [x] טיפוסי Supabase בצד קליינט עדיין תואמים ב-`src/integrations/supabase/types.ts`.
  - אימות: RPC types לשיתוף קיימים בקובץ הטיפוסים.
- [x] לא נוצרה עקיפה של RLS/policies בלי migration מתאים.
  - אימות (MAIN בלבד, ללא `protected_spaces`):
    - `public.gardens`: RLS מופעל + policies מפורשים ב-`supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql` וב-`supabase/migrations/20260318234137_d4a06778-df6c-4603-9f38-4d84b5deb859.sql`.
    - `public.check_ins`: RLS מופעל + policy מעודכן `Users can manage own check-in` ב-`supabase/migrations/20260316100000_check_in_logic.sql`.
    - `public.dogs`: RLS מופעל + policies owner-scoped ב-`supabase/migrations/20260319000000_create_dogs_table.sql`.
    - `public.dog_profile_members` / `public.dog_share_invites`: RLS מופעל + owner-based policies + revoke/grant מדויק לפונקציות `SECURITY DEFINER` ב-`supabase/migrations/20260408021000_dog_profile_sharing_mvp.sql`.

## Verification

- [x] הרצתי לפחות את הבדיקות הרלוונטיות לשינוי.
  - אימות: `npm test -- --run` עבר (`2` קבצי בדיקות, `3` בדיקות ירוקות).
- [x] אם אין טסט קיים לאזור ששונה, הוספתי טסט קטן או תיעדתי פער.
  - סטטוס: לא בוצע שינוי קוד אפליקטיבי בסבב זה; פער הכיסוי הכללי מתועד.
- [ ] צירפתי צעדי בדיקה ידניים קצרים ב-PR.
  - סטטוס: ממתין לפתיחת PR בפועל.
