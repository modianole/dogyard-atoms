# DogYard — MVP Roadmap

> **Supporting Document / Not the active checklist**  
> מסמך זה נשמר כ־roadmap ותיעדוף.  
> את רשימת המשימות הפעילה יש לנהל ב־`copilot/MVP_EXECUTION_CHECKLIST.md`.

**Created:** 2026-04-07  
**Goal:** רשימת המשימות שצריך להשלים כדי לעלות לאוויר עם MVP יציב, מצומצם וברור.  
**Related docs:** `copilot/MVP_EXECUTION_CHECKLIST.md`, `copilot/supporting/FEATURES_BY_BRANCH.md`, `copilot/archive/TASKS_CHECKLIST.md`, `copilot/supporting/MVP_ACTION_PLAN.md`

---

## עקרון העבודה

ה־MVP צריך לעלות עם **core flows בלבד**:

- מציאת גינות
- צפייה בפרטי גינה
- התחברות
- פרופיל משתמש בסיסי
- ניהול כלבים
- הגדרות בסיסיות
- מסמכים משפטיים
- ייבוא/אכלוס נתוני גינות

כל דבר שלא קריטי להפעלה בטוחה, ברורה ויציבה — נשאר מחוץ ל־`main` בגרסת ה־go-live.

---

## סטטוס נוכחי בקצרה

### כבר קיים / במצב טוב
- `Map` ו־`GardenDetails`
- `Auth` + `ResetPassword`
- `Profile` + `Dogs`
- `Settings`
- `Privacy` + `Terms`
- `AdminImport`
- Build Android מתוך `android/` עבר בהצלחה

### עדיין דורש החלטה / עבודה
- `AddGarden` לא תואם לגמרי ל־schema הנוכחי
- `Notifications` הוא placeholder
- פיצ'רי community / hazard / restaurant עדיין לא שלמים ל־launch
- עדיין נדרשות בדיקות ידניות ל־MVP על אמולטור/מכשיר

---

## P0 — חייבים לפני עלייה לאוויר

### 1. לייצב את `main` כ־MVP בלבד
- [ ] להחליט סופית מה נכנס ל־MVP ומה יוצא ממנו
- [ ] להסיר/להסתיר מה־`main` flows חלקיים שלא מוכנים ל־launch
- [ ] לוודא שכל route ב־`main` באמת ברמת production-ready

### 2. לסגור פערי functional bugs ב־core flows
- [ ] לתקן את `AddGarden` מול schema עדכני או להוציא אותו מה־MVP
- [ ] לבדוק ש־`Map` טוען גינות אמיתיות מה־DB
- [ ] לבדוק ש־`GardenDetails` עובד על גינה קיימת ולא נופל בגינה חסרה
- [ ] לבדוק שהתחברות / logout / reset password עובדים מקצה לקצה
- [ ] לבדוק שיצירה/מחיקה של כלב ב־`Profile` עובדת תקין
- [ ] לבדוק שעדכון פרופיל ב־`Settings` נשמר בפועל

### 3. בדיקות MVP ידניות שחייבות לעבור
- [ ] פתיחת אפליקציה ראשונית ללא קריסה
- [ ] ניווט בין `/`, `/map`, `/garden/:id`, `/profile`, `/settings`
- [ ] התחברות / יציאה / איפוס סיסמה
- [ ] הוספת כלב / מחיקת כלב
- [ ] טעינת פרטי גינה + peak hours + visitors
- [ ] בדיקת התנהגות במצב ללא משתמש מחובר
- [ ] בדיקת התנהגות במצב DB ריק / נתון חסר

### 4. Release readiness
- [ ] build נקי ל־debug
- [ ] build נקי ל־release / AAB
- [ ] לוודא שאין שימוש ב־dev server URL ב־production
- [ ] לוודא `google-services.json` ו־Crashlytics מוגדרים רק באופן תקין
- [ ] לוודא secrets לא קשיחים בקוד

### 5. Store / compliance minimum
- [ ] לוודא `Privacy Policy` נגישה מהמוצר
- [ ] לוודא `Terms of Service` נגישה מהמוצר
- [ ] להכין אייקונים / assets סופיים לחנות
- [ ] להכין screenshots בסיסיים ל־store listing

---

## P1 — מיד אחרי עלייה לאוויר

### הרחבות שכדאי לסגור בסמוך ל־launch
- [ ] `feature/add-garden` — geocoding + moderation אמיתי
- [ ] `feature/community-social` — קהילה מחוברת לדף הבית + התראות בסיסיות
- [ ] `feature/hazard-reporting` — טופס דיווח עובד + סטטוסים

### hardening
- [ ] להוסיף telemetry / event logging חשובים
- [ ] להוסיף error states נעימים יותר למשתמש
- [ ] להוסיף smoke tests ל־core pages

---

## P2 — לאחר ייצוב MVP

### פיצ'רים שלא צריכים לחסום launch
- [ ] `feature/restaurant-ordering`
- [ ] social feed מלא
- [ ] owner/admin portals מלאים
- [ ] notifications מלאות
- [ ] hazard dashboard

---

## Gate לעלייה לאוויר

אין עלייה לאוויר לפני שכל אלה מסומנים:

- [ ] `main` מכיל רק scope של MVP
- [ ] אין route חלקי/שבור ב־production
- [ ] build release עובר
- [ ] כל ה־core flows נבדקו ידנית
- [ ] מסמכים משפטיים ו־assets זמינים
- [ ] יש החלטה ברורה מה deferred ל־post-MVP

---

## המלצת סדר ביצוע

1. `copilot/supporting/MVP_SCOPE_SPLIT.md` — להחליט מה נשאר ב־`main`
2. לתקן/להוציא flows חלקיים
3. לבצע regression ידני על כל core flow
4. לבנות release candidate
5. להכין store assets
6. לעלות לאוויר



