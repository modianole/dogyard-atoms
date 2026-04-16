# IOS - Checklist להעלאת DogYard ל-iPhone ול-App Store

> מטרת המסמך: צ'קליסט ביצועי ומדורג כדי להביא את האפליקציה לפרודקשן ב-iOS ולפרסום ב-Apple App Store.
>
> מותאם למצב הריפו הנוכחי: `appId` = `com.dogyard.app`, `appName` = `דוג יארד - DogYard`, קיימת מעטפת Android, ולא נמצאה כרגע תיקיית `ios/`.

## 0) הגדרת מצב פתיחה (Baseline)

- [ ] לוודא שגרסת ה-web יציבה לפרודקשן (`npm run build` עובר, מסכים קריטיים עובדים).
- [ ] לוודא שה-auth עובד בדפדפן דרך `/auth/callback`.
- [ ] לוודא שתלויות Capacitor קיימות ומעודכנות ל-iOS:
  - [ ] `@capacitor/core`
  - [ ] `@capacitor/cli`
  - [ ] `@capacitor/app`
  - [ ] `@capacitor/browser`
  - [ ] `@capacitor/geolocation`
- [ ] לתעד commit/tag שממנו מתחילים תהליך release (לשחזור מהיר אם צריך rollback).

## 1) Apple Developer וחשבון פרסום

- [ ] לוודא שיש Apple ID ארגוני/צוותי פעיל.
- [ ] להצטרף ל-Apple Developer Program (Team) בתוקף.
- [ ] להגדיר הרשאות מתאימות לכל מי שמעורב ב-release (Admin / App Manager / Developer).
- [ ] לפתוח אפליקציה חדשה ב-App Store Connect עם Bundle ID מדויק: `com.dogyard.app`.
- [ ] להגדיר Tax/Banking/Agreements ב-App Store Connect (אחרת אי אפשר לשחרר לפרודקשן).

## 2) תשתית iOS בפרויקט (Capacitor)

- [ ] אם אין `ios/`, ליצור פלטפורמה:

```powershell
npx cap add ios
```

- [ ] אחרי כל build web משמעותי, לבצע sync:

```powershell
npm run build
npx cap sync ios
```

- [ ] לפתוח את הפרויקט ב-Xcode:

```powershell
npx cap open ios
```

- [ ] ב-Xcode > Target > Signing & Capabilities:
  - [ ] לבחור Team נכון.
  - [ ] לוודא Bundle Identifier: `com.dogyard.app`.
  - [ ] לאפשר Auto-signing (או להגדיר provisioning ידני אם נדרש ארגונית).

## 3) קונפיגורציית Auth/Deep Link (קריטי)

- [ ] לאשר התאמה בין קוד האפליקציה והגדרות Supabase:
  - [ ] ב-`src/pages/Auth.tsx` מוגדר redirect native: `com.dogyard.app://auth-callback`.
  - [ ] ב-`src/App.tsx` יש listener ל-`appUrlOpen` שמטפל ב-callback.
  - [ ] ב-`src/pages/AuthCallback.tsx` קיים `exchangeCodeForSession` ל-web callback.
- [ ] ב-Supabase Auth להוסיף Allow List ל-redirect URLs:
  - [ ] `com.dogyard.app://auth-callback`
  - [ ] דומיין ה-web callback (לדוגמה `https://<your-domain>/auth/callback`)
- [ ] לבצע בדיקות end-to-end לשני מסלולים:
  - [ ] Web: login -> `/auth/callback` -> session פעילה.
  - [ ] iOS: login social/email -> חזרה לאפליקציה דרך deep link -> session פעילה.

## 4) Environment לפרודקשן (iOS)

- [ ] לוודא שב-build פרודקשן מוזרקים ערכים נכונים ל-Vite:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` (או `VITE_SUPABASE_ANON_KEY`)
  - [ ] `VITE_GOOGLE_MAPS_API_KEY`
- [ ] לוודא שהמפתחות הם של סביבת Production ולא Dev.
- [ ] לוודא שה-key של Google Maps מורשה ל-iOS Bundle ID המתאים (`com.dogyard.app`) אם משתמשים בהגבלת אפליקציות.
- [ ] לא להשאיר סודות שאינם client-safe בתוך bundle.

## 5) הרשאות, Privacy ויכולות iOS

- [ ] להגדיר ב-`Info.plist` תיאורי שימוש (Usage Descriptions) בהתאם לפיצ'רים:
  - [ ] Location When In Use (`NSLocationWhenInUseUsageDescription`) עבור Geolocation וניווט.
  - [ ] אם תתווסף גישה נוספת (Camera/Photos וכו') להוסיף תיאור ייעודי.
- [ ] לוודא שהנוסח למשתמש ברור ותואם שימוש אמיתי (Apple בודקת את זה).
- [ ] לעבור על App Privacy ב-App Store Connect ולהצהיר במדויק אילו נתונים נאספים/מקושרים למשתמש.
- [ ] להכין URLs למסמכי Privacy/Terms (קיימים routes `"/privacy"`, `"/terms"` באפליקציה).

## 6) איכות לפני הפצה (QA Checklist)

- [ ] Smoke test מלא על iPhone אמיתי (לא רק סימולטור):
  - [ ] התחברות email + Google.
  - [ ] טעינת מפה ורשימת גינות.
  - [ ] דף פרטי גינה + check-in.
  - [ ] Profile וכלבים + שיתוף פרופיל כלב.
  - [ ] מסכי Admin (רק למשתמש מורשה).
  - [ ] RTL/עברית ואנגלית במסכים ראשיים.
- [ ] לוודא יציבות רשת חלשה/ניתוקים (timeouts, הודעות שגיאה, recovery).
- [ ] להריץ בדיקות אוטומטיות זמינות (לפחות unit הקיימים) לפני archive.
- [ ] לוודא גרסה ומספר build מעודכנים לפני כל העלאה.

## 7) הכנה ל-App Store Connect

- [ ] להכין מטא-דאטה:
  - [ ] שם אפליקציה, subtitle, description.
  - [ ] Keywords.
  - [ ] Support URL ו-Privacy Policy URL.
- [ ] להכין screenshots לפי דרישות Apple (iPhone sizes רלוונטיים).
- [ ] לקבוע Age Rating, קטגוריה, ו-Content Rights.
- [ ] להצהיר Export Compliance (הצפנה) בהתאם לשימוש בפועל.

## 8) Build, Archive ו-Upload מ-Xcode

- [ ] לבחור Scheme/Target הנכון ל-release.
- [ ] Product -> Archive.
- [ ] ב-Organizer לבצע Distribute App -> App Store Connect.
- [ ] לוודא שהעלאה עברה ללא שגיאות חתימה/פרופילים.
- [ ] ב-App Store Connect לשייך את ה-build לגרסה המתאימה.

## 9) TestFlight

- [ ] להוסיף Internal Testers ולהריץ בדיקת sanity מלאה.
- [ ] אם נדרש, לפתוח External Testing ולעבור Beta App Review.
- [ ] לאסוף תקלות קריטיות ולסגור לפני Submit ל-Review.
- [ ] לוודא שבאגים שנסגרו נבדקו מחדש על build מעודכן.

## 10) Submit ל-Review ושחרור

- [ ] למלא הערות ל-reviewer (כולל חשבון בדיקה אם צריך login).
- [ ] להגיש ל-Apple Review.
- [ ] לבחור מדיניות release:
  - [ ] Manual release אחרי אישור, או
  - [ ] Automatic release.
- [ ] אחרי אישור, לבצע בדיקת production קצרה מה-App Store בפועל.

## 11) ניטור אחרי שחרור

- [ ] לעקוב אחרי crashes ויציבות (Xcode Organizer + כלי ניטור בשימוש).
- [ ] לעקוב אחרי authentication errors ו-deep-link failures.
- [ ] לוודא KPI בסיסיים: התקנות, פתיחה ראשונה, שיעור התחברות.
- [ ] להכין hotfix plan לגרסה מהירה אם מזוהה regression.

## 12) סיכונים ידועים ופעולות מניעה

- [ ] סיכון: callback auth לא מוגדר נכון ב-Supabase -> כשל התחברות ב-native.
  - [ ] מניעה: בדיקת `com.dogyard.app://auth-callback` end-to-end לפני Submit.
- [ ] סיכון: הרשאות location חסרות/נוסח לא תואם -> דחייה ב-Review.
  - [ ] מניעה: ניסוח מדויק ב-`Info.plist` + בדיקה מעשית על מכשיר.
- [ ] סיכון: Google Maps key לא מורשה ל-iOS bundle -> מפה ריקה בפרודקשן.
  - [ ] מניעה: בדיקה יזומה על build חתום עם key פרודקשן.
- [ ] סיכון: פערים ב-RTL/תרגום במסכים נבחרים.
  - [ ] מניעה: מעבר QA דו-לשוני לפני העלאה.

## 13) Go / No-Go קצר לפני לחיצה על Submit

- [ ] Auth (web + native) תקין.
- [ ] Map + Gardens + Check-in תקין.
- [ ] Profile/Dogs/Share תקין.
- [ ] Privacy Policy + Terms זמינים וקישורים תקינים.
- [ ] אין blocker קריטי פתוח.
- [ ] יש תוכנית rollback ותיעוד build release.

---

## פקודות שימושיות (PowerShell)

```powershell
npm install --legacy-peer-deps
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

> הערה: הפקודות למעלה הן תבנית עבודה. ייתכן שיידרשו התאמות לפי גרסת Xcode/macOS, הגדרות Team, ופרופילי חתימה בארגון.


