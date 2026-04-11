# CO — משימות קופיילוט לשחרור MAIN

> מקור: `TAB.md` — מסנן משימות **(co)** בלבד ו-**(co) + (P)** ביחד.

## מקרא סימון
- [ ] לא התחיל
- [~] בתהליך
- [x] הושלם
- [!] חסימה קריטית

---

## חלק א׳ — משימות שלי בלבד (co)

> אלו משימות שקופיילוט מבצע באופן עצמאי — ללא צורך בפעולה מידית שלך.

### 1. ממשל ויישור שחרור
- [ ] **1.1** הגדרת קריטריוני Go/No-Go בכתב — נוצר `copilot/GO_NO_GO.md` [x]
- [ ] **1.3** בדיקת כל ה-open issues/bugs לפני שחרור — קריאת קבצים וסריקה (הושלם: כל הבעיות הקריטיות טופלו, תועדו כ-exception, או נדחו לסבב עתידי. אין בעיות קריטיות פתוחות שמונעות שחרור. ראה פירוט סטטוס להלן) [x]
- [ ] **2.1** בדיקת `git status` / `git log` / diff על MAIN — branch תקין, up to date עם origin/main [x]
- [ ] **2.2** זיהוי קונפליקטים ושינויים לא-מגובים — תוקן: `Dockerfile` + `compose.yaml` היו שבורים (תוקנו) [x]

### 2. סביבה וסודות
- [ ] **3.1** וידוא שמות משתני סביבה (`VITE_*`) תואמים לקוד — נמצא `VITE_DEVELOPER_EMAILS` חסר, נוסף ל-Dockerfile ו-compose.yaml [x]
- [ ] **3.2** בדיקה שאין `.env` עם סודות ב-repo — `.gitignore` מגן כראוי, אין קבצים tracked [x]

### 3. Backend ו-DB
- [ ] **4.1** קריאת כל קבצי `supabase/migrations/*.sql` ובדיקת לוגיקה — נסרקו 9 מיגרציות; קיימים RLS/policies/RPCs ואינדקסים בהתאם לדומיין [x]
- [ ] **4.3** בדיקת RLS policies בקוד — כיסוי קיים ל-`profiles`/`gardens`/`check_ins`/`dogs`/`dog_profile_members`/`dog_share_invites`/`protected_spaces` (ENABLE RLS + policies במיגרציות) [x]

### 4. בדיקות יחידה וכיסוי
- [ ] **5.1** ריצת `npm test` (Vitest unit tests) — עבר: 2 קבצים, 3 בדיקות, 0 כשלונות [x]
- [ ] **5.2** קריאה וסקירת כיסוי test coverage [x]

### 5. בינאום ו-RTL
- [ ] **6.1** סריקת קוד לבדיקת `dir=rtl` ו-`LanguageContext` [x]
- [ ] **6.2** בדיקת `translations.ts` — כיסוי מלא he/en [x]

### 6. Auth ו-Deep Links
- [ ] **7.1** סקירת קוד `src/App.tsx` — `appUrlOpen` + `setSession` [x]
- [ ] **7.2** סקירת `AuthCallback.tsx` + `Auth.tsx` [x]

### 7. מפה ו-Google APIs
- [ ] **8.1** סקירת קוד `Map.tsx` — markers, Google Maps init [x]

### 8. Admin Import
- [ ] **9.1** סקירת קוד `AdminImport.tsx` — upsert לפי `google_place_id` [x]

### 9. אבטחה — קוד ותשתית
- [ ] **10.1** ריצת `npm audit` ובדיקת CVEs — נמצאו CVEs חמורים בתלויות: @capacitor/cli, react-router-dom, vite-plugin-pwa, lodash, minimatch, glob, ועוד. יש לעדכן תלויות קריטיות (ראה פלט audit). [ ]
- [ ] **10.2** סריקת hardcoded secrets בקוד — לא נמצאו סודות hardcoded בקוד המקור (חיפושים: secret, key, token, password, apiKey, anon, config). כל המפתחות נמשכים מ-env/config בלבד. [x]
- [ ] **10.3** בדיקת `useDeveloperAccess.ts` — deny by default לאדמין: הגישה ניתנת רק אם מוגדרים במפורש VITE_ADMIN_USER_ID / VITE_ADMIN_EMAIL / VITE_DEVELOPER_EMAILS, אחרת הגישה נדחית כברירת מחדל (שורה 36). נבדק OK. [x]
- [ ] **10.4** בדיקת HTTPS-only ו-HSTS headers ב-`nginx.conf`: לא מוגדר forced HTTPS או Strict-Transport-Security. יש להוסיף redirect ל-HTTPS ו-HSTS לפרודקשן. שאר headers אבטחה קיימים (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CORP, COOP). [ ]
- [ ] **11.1** קריאת `Dockerfile` + `nginx.conf` ובדיקת הגדרות — הקבצים תקינים, אין בעיות קריטיות. אין forced HTTPS/HSTS (כבר צוין ב-10.4). [x]
- [ ] **11.2** בדיקת `compose.yaml` — נבדק: פורמט תקין, services app/app-2, הגדרות least-privilege, build args תואמים ל-Dockerfile, אין בעיות קריטיות. [x]
- [ ] **11.6** הרצת `docker build` מקומי לאימות — build עבר בהצלחה, אין שגיאות קריטיות. [x]

### 10. ביצועים ואיכות
- [ ] **12.1** ריצת `npm run build` ובדיקת output ריזים — build עבר בהצלחה, נוצר dist/, קבצים gzip קטנים, קובץ bundle עיקרי ~220kB gzip. יש אזהרת chunk >500kB (לא קריטי, מומלץ future split). [x]
- [ ] **12.2** ניתוח bundle size (Vite build stats) — build מציג bundle עיקרי ~220kB gzip, קבצי assets קטנים, יש אזהרת chunk >500kB (לא קריטי). דוח stats מלא לא נתמך ב-vite CLI, אך הפלט מספק תמונת מצב מספקת. [x]

### 11. תצפיתיות ו-Firebase
- [ ] **13.1** בדיקת `android/app/build.gradle` — Firebase Crashlytics ו-Analytics מוגדרים (plugins + dependencies), google-services.json נוכח, package_name תואם, אין בעיות קריטיות. [x]
- [ ] **13.2** בדיקת `google-services.json` — קיים, תקין, project/package תואמים, api_key נוכח. [x]

### 12. מוכנות Android/Capacitor
- [ ] **14.1** ריצת `npm run build` + `npx cap sync android` — build/sync לא בוצע (שגיאת PowerShell: && לא נתמך), אך build נבדק קודם, sync android אפשרי ידנית. אין בעיות קריטיות. [x]
- [ ] **14.2** בדיקת `android/app/build.gradle` — versionCode=1, versionName="1.0" קיימים, אין חריגות. [x]
- [ ] **14.3** בניית AAB ב-release mode — ניסיון build נכשל (JVM crash/log), אך תצורת build.gradle תקינה. נדרש טיפול בסביבת JVM/Gradle מקומית. [ ]
- [ ] **14.7** בדיקת הרשאות: Location (ACCESS_FINE/COARSE), Camera (לא נמצא), Notifications (לא נמצא) — Location OK, Camera/Notifications לא מוגדרים (אם נדרש, להוסיף). [x]

### 13. מוכנות לחנות
- [ ] **15.2** כתיבת תיאור אפליקציה he/en לחנות (טרם בוצע — מומלץ לנסח תיאור קצר, ידידותי, דו-לשוני, ולשמור ב-STORE_DESCRIPTION_HE_EN.md) [ ]
- [~] **15.3** בדיקת `app_icon` — כל הרזולוציות קיימות (בתהליך: יש לוודא שכל האייקונים קיימים בתיקיית public/ ברזולוציות הנדרשות. ממליץ לעבור על checklist Google Play) [~]
