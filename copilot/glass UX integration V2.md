# Glass UX Integration V2 — מסלול קצר ואפקטיבי

## מטרת V2
להטמיע את עיצוב ה-Glass החדש במהירות, עם מינימום סיכון לרגרסיות ב-Auth, Map, Supabase ו-RTL.

## Checklist ביצוע (מקוצר)
- [ ] להוסיף שכבת עיצוב גלובלית (tokens + fonts + glass effects) בלי לשבור לוגיקה קיימת.
- [ ] להוסיף 3 רכיבי בסיס: `GlassCard`, `GlassSidebar`, `LoadingScreen`.
- [ ] לעדכן `src/App.tsx` למעטפת חדשה (TopBar + Sidebar + Background), בלי לשנות routes.
- [ ] לעטוף עמודים קיימים ב-Glass (לא rewrite מלא): `Index`, `Map`, `Auth`, `Profile`, `GardenDetails`.
- [ ] לשמור אינווריאנטים קריטיים: `formatGardenName`, `google_place_id upsert`, `shalter`.
- [ ] לארכב UI ישן ל-`src/components/legacy-ui/` במקום למחוק.
- [ ] להריץ `npm test` + `npm run build` + בדיקת RTL/Auth/Map ידנית.

---

## Phase 1 — Foundation (יום 1)

### 1) Dependencies
```powershell
npm install motion --legacy-peer-deps
```

### 2) עיצוב גלובלי
- קובץ יעד: `src/index.css`
- להוסיף:
  - Google Fonts (`Syne`, `DM Sans`)
  - Glass CSS vars (`--glass-light`, `--glass-medium`, `--glass-strong`, `--glass-border`, `--glass-blur`)
  - gradient variables ו-scrollbar-hide

### 3) רכיבים חדשים
- `src/components/ui/GlassCard.tsx` (מה-Neo UI)
- `src/components/LoadingScreen.tsx` (עם `t('appName')`, `t('loadingScreen')`)
- `src/components/GlassSidebar.tsx` (Router-based + RTL-aware)

---

## Phase 2 — App Shell Integration (יום 1-2)

### 4) עדכון מעטפת ב-`src/App.tsx`
- להסיר שימוש ב-`Navbar`/`Footer` מהמעטפת החדשה.
- להוסיף:
  - fixed glass background + ambient glow
  - top bar (menu + avatar)
  - `GlassSidebar`
  - `LoadingScreen` בטעינה ראשונה
- לשמור את הרוטינג הקיים כפי שהוא.

### 5) ניתוב Sidebar לרוטינג קיים
מיפוי תפריט:
- Home -> `/`
- Map -> `/map`
- Profile -> `/profile`
- Settings -> `/settings`

---

## Phase 3 — Page Skinning (יום 2-3)

### 6) עמודים בעדיפות גבוהה
- `src/pages/Index.tsx`: Hero/Stats/List ב-Glass style עם דאטה קיים.
- `src/pages/Map.tsx`: לשמור Google Maps אמיתי, להוסיף שכבת controls/filter/list ב-Glass.
- `src/pages/Auth.tsx`: טפסים וכפתורים בסגנון glass.
- `src/pages/Profile.tsx`: cards ו-sections ב-Glass.
- `src/pages/GardenDetails.tsx`: sections ב-Glass + background overlay.

### 7) i18n/RTL חובה
- כל טקסט חדש נכנס ל-`src/i18n/translations.ts` (he/en).
- Sidebar ו-TopBar חייבים לעבוד ב-RTL (כולל מיקום פתיחה).

---

## Phase 4 — Legacy Archiving + QA (יום 3)

### 8) ארכוב עיצוב ישן
תיקייה:
- `src/components/legacy-ui/`

להעביר:
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`
- `src/components/CommunitySection.tsx`
- `src/components/FeaturesGrid.tsx`
- `src/App.css` (רק אחרי מיזוג CSS)

> לא למחוק קבצים ישנים לפני סיום QA.

### 9) בדיקות
```powershell
npm test
npm run build
```

בדיקות ידניות:
- Auth callback: `/auth/callback` + native deep-link
- Map rendering + markers
- RTL מלא (he)
- Profile + Dog sharing flow

---

## אינווריאנטים שאסור לשבור
- תצוגת שמות גינות תמיד דרך `formatGardenName` (`src/hooks/useGardens.ts`).
- ב-Admin Import לשמור `upsert` לפי `google_place_id` (`src/pages/AdminImport.tsx`).
- nearest protected space נשען כרגע על `shalter` (`src/hooks/useNearestShalter.ts`).
- מסכים מוגנים נשארים דרך `ProtectedRoute` (`/profile`, `/settings`).

---

## Do / Don't קצר

| תחום | DO | DON'T |
|---|---|---|
| מעטפת | להחליף shell ב-`src/App.tsx` בלבד | לשכתב את כל העמודים בבת אחת |
| דאטה | לשמור hooks ו-queries קיימים | להחליף לוגיקה עסקית תוך כדי עיצוב |
| i18n | להוסיף מפתחות ל-translations | hardcoded באנגלית |
| RTL | לבדוק sidebar/topbar ב-he | להניח ש-LTR מספיק |
| Legacy | להעביר ל-`legacy-ui` | למחוק קבצים לפני QA |

---

## Definition of Done
- [ ] מעטפת Glass עובדת בכל routes הקיימים.
- [ ] 5 עמודי הליבה מעוצבים ב-Glass בלי שבירת לוגיקה.
- [ ] כל הטקסטים החדשים מתורגמים he/en.
- [ ] RTL תקין כולל Sidebar.
- [ ] `npm test` ו-`npm run build` עוברים.
- [ ] קבצי UI ישנים בארכיב ולא נמחקו.

---

## חיבור מהיר ל-Figma MCP (Windows)

```powershell
npm run figma:check
npm run figma:mcp
```

אחרי הרצה:
1. לפתוח ב-Figma את MCP Figma Plugin.
2. להעתיק את ה-Channel ID מהפלאגין.
3. בצ'אט Copilot לשלוח: `Join Figma channel <CHANNEL_ID>`.
4. ואז לבקש: `Read my design and map it to existing React routes in src/App.tsx`.

> אם רוצים לעבוד עם השרת המקומי שבתיקיית `mcp-figma/`: להריץ `npm run figma:setup:local` ואז `npm run figma:mcp:local`.
