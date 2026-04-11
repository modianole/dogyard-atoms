# Go / No-Go — קריטריוני שחרור MAIN

> תאריך: אפריל 2026 | גרסה: 1.0

## כלל אצבע
**Go** = כל סעיפי חובה מסומנים ✅, אפס חסימות קריטיות [!].  
**No-Go** = אחד או יותר מסעיפי חובה לא הושלם, או קיים [!] פתוח.

---

## 🔴 חובה (Blockers) — אסור לשחרר בלעדיהם

### קוד ו-Build
- [ ] `npm run build` עובר ללא שגיאות
- [ ] `npx cap sync android` עובר ללא שגיאות
- [ ] AAB נבנה בהצלחה ב-release mode עם signing תקין
- [ ] אין TypeScript errors קריטיים שמונעים build

### Auth ו-Security
- [ ] Login (email + Google OAuth) עובד ב-Web וב-Native
- [ ] Deep link `com.dogyard.app://auth-callback` עובד על מכשיר אמיתי
- [ ] Reset Password עובד מקצה לקצה
- [ ] אין hardcoded secrets / API keys בקוד
- [ ] RLS מופעל על כל טבלאות הליבה ב-Supabase production
- [ ] `useDeveloperAccess` — admin חסום כברירת מחדל

### פיצ'רים ליבה
- [ ] מפה נטענת ומציגה גינות עם markers
- [ ] פרטי גינה נפתחים ותקינים
- [ ] צ'ק-אין (arrived / on_way) עובד ומסתיים בזמן
- [ ] פרופיל כלב — יצירה, עריכה, שיתוף
- [ ] ניווט מרחב מוגן (`useNearestShalter`) מחזיר תוצאה

### DB ו-Migration
- [ ] כל migrations רצו בהצלחה על production
- [ ] גיבוי DB בוצע לפני deploy

---

## 🟡 מומלץ (Warnings) — לא חוסמים אבל חשוב לתעד

- [ ] `npm audit` — אין CVEs בדרגת High/Critical ללא מענה
- [ ] Bundle size סביר (< 2MB gzip לאפליקציה הראשית)
- [ ] RTL ועברית תקינים ב-90%+ מהמסכים
- [ ] `npm test` — כל הטסטים הקיימים עוברים
- [ ] Firebase Crashlytics מוגדר ומדווח
- [ ] אין console errors בולטים ב-production build

---

## 🟢 נחמד (Nice to Have) — לא חוסמים

- [ ] Lighthouse score > 70 על Mobile
- [ ] כיסוי תרגומים he/en מלא ב-100%
- [ ] Smoke tests אוטומטיים עוברים על Staging
- [ ] תיאור חנות מוכן בשתי שפות

---

## החלטת Go/No-Go הסופית

| תאריך | מחליט | החלטה | הערות |
|-------|-------|-------|-------|
| | | ⬜ Go / ⬜ No-Go | |

---

> מסמך זה מתעדכן לפני כל שחרור. קריטריוני Blocker הם מקור האמת.

