# TAB — טבלת משימות לפי מבצע

> **הערה:** משימות **(co)** ו-**(co)+(P)** הועברו ל-`CO.md`.
> קובץ זה מכיל **רק** משימות שדורשות **(P)** או סוכן חיצוני.

## מקרא
| סמל | משמעות |
|-----|--------|
| **(P)** | אתה — בן-אדם עם גישה לממשקים חיצוניים |
| **(claude)** | Claude Desktop — סוכן עם גישה מלאה לקבצים + ביצוע פקודות מחוץ ל-IDE |
| **(gpt)** | ChatGPT / GPT-4o עם כלים (Browsing, Code Interpreter, Actions) |
| **(supabase)** | ממשק Supabase Dashboard / CLI בידי המשתמש |
| **(gplay)** | Google Play Console — רק (P) |
| **(firebase)** | Firebase Console — רק (P) |
| **(gcp)** | Google Cloud Console — רק (P) |

---

## טבלת משימות — (P) וסוכנים חיצוניים

| # | משימה | מבצע |
|---|-------|------|
| **1.2** | החלטת Go/No-Go הסופית | **(P)** — החלטה עסקית |
| **2.3** | מיזוג branch לפני שחרור (אישור מיזוג) | **(P)** — אחראי על ה-merge |
| **2.4** | העלאת commit אחרון ל-origin/main (`git push`) | **(P)** עם credentials |
| **3.3** | הזנת ערכי secrets אמיתיים (API keys, DB URLs) | **(P)** — הזנה ידנית |
| **3.4** | הגדרת secrets בסביבת ייצור (Vercel/Cloud Run/Railway) | **(P)** דרך ממשק ה-provider |
| **4.2** | ריצת migrations על Supabase production | **(P)** עם Supabase CLI / Dashboard |
| **4.4** | אישור RLS פעיל בפועל ב-Dashboard | **(supabase)** / **(P)** |
| **4.6** | גיבוי DB לפני deploy | **(P)** / **(supabase)** |
| **5.3** | בדיקת flow מפה: פתיחה → markers → פרטי גינה | **(P)** ידנית / **(claude)** Playwright |
| **5.4** | בדיקת צ'ק-אין: arrived/on_way, תוקף שעה | **(P)** ידנית |
| **5.5** | בדיקת פרופיל כלב + שיתוף (`create_dog_share_invite`, `accept_dog_share_invite`) | **(P)** ידנית |
| **5.6** | בדיקת ניווט מרחב מוגן (`useNearestShalter`) | **(P)** ידנית במכשיר |
| **5.7** | בדיקת `AdminGardens` — עדכון status גינות | **(P)** ידנית (רק admin) |
| **6.3** | בדיקה ויזואלית RTL בדפדפן (עברית + אנגלית) | **(P)** ידנית |
| **6.4** | בדיקת Responsive: מובייל / טאבלט / דסקטופ | **(P)** / **(claude)** Playwright |
| **6.5** | בדיקת BottomNav, Navbar, Footer — תצוגה תקינה בכל עמוד | **(P)** ידנית |
| **7.3** | ניסוי login email/password בפועל | **(P)** ידנית |
| **7.4** | ניסוי Google OAuth — Web | **(P)** ידנית |
| **7.5** | ניסוי Google OAuth — Native (Capacitor + deep link) | **(P)** במכשיר אנדרואיד |
| **7.6** | ניסוי Reset Password — Web + Native | **(P)** ידנית |
| **7.7** | ניסוי `ProtectedRoute` — redirect ל-`/auth` | **(P)** ידנית |
| **8.2** | בדיקת `VITE_GOOGLE_MAPS_API_KEY` — domain restrictions | **(P)** / **(gcp)** |
| **8.3** | ניסוי מפה חי — טעינת גינות, חיפוש, מיקום | **(P)** ידנית |
| **8.4** | בדיקת Places API quota ו-billing alerts | **(P)** / **(gcp)** |
| **9.2** | ניסוי import בסביבת staging (לא production) | **(P)** ידנית |
| **10.5** | בדיקת OWASP Top 10 ידנית (XSS, CSRF, Injection) | **(P)** / **(claude)** |
| **10.6** | בדיקת CORS policy על Supabase | **(supabase)** / **(P)** |
| **11.3** | הגדרת Network policies / Firewall rules בענן | **(P)** / **(gcp)** |
| **11.4** | בדיקת שאין חשיפת פורטים לא-נחוצים | **(P)** / **(gcp)** |
| **11.5** | הגדרת IAM roles — least privilege | **(P)** / **(gcp)** |
| **12.4** | load test בסיסי על ה-API | **(claude)** / **(P)** עם k6/artillery |
| **13.3** | הגדרת alerts ב-Firebase Crashlytics Console | **(P)** / **(firebase)** |
| **13.4** | הגדרת Supabase monitoring + alerts | **(P)** / **(supabase)** |
| **13.5** | הגדרת uptime monitoring (Betterstack/UptimeRobot) | **(P)** |
| **14.4** | ניהול keystore ו-signing credentials | **(P)** — גישה ל-keystore |
| **14.5** | הרצת AAB על מכשיר אמיתי / Android Emulator | **(P)** / Android Studio |
| **14.6** | בדיקת deep links Native על מכשיר (`com.dogyard.app://`) | **(P)** ידנית |
| **15.4** | העלאת AAB ל-Google Play Console (Internal Testing) | **(P)** / **(gplay)** |
| **15.5** | מילוי Content Rating questionnaire | **(P)** / **(gplay)** |
| **15.6** | הגדרת Privacy Policy URL ב-Play Console | **(P)** |
| **15.7** | בדיקת Data Safety form (Google Play) | **(P)** |
| **16.1** | הגדרת סביבת Staging נפרדת מ-Production | **(P)** |
| **16.4** | בדיקת כל ה-critical paths ידנית ב-Staging לפני Go-Live | **(P)** ידנית |
| **17.2** | ניסוי rollback DB (Supabase migrations down) | **(P)** / **(supabase)** |
| **17.3** | הגדרת fallback version ב-Play Console | **(P)** / **(gplay)** |
| **18.1** | הגדרת rollout הדרגתי (10% → 50% → 100%) | **(P)** / **(gplay)** |
| **18.2** | ניטור crash rate בזמן הפצה | **(P)** / **(firebase)** |
| **18.3** | אישור להמשך rollout / עצירה | **(P)** — החלטה עסקית |
| **20.3** | העברת אחריות תפעולית + הגדרת on-call | **(P)** |

---

## סיכום עומס לפי מבצע

| מבצע | כמות משימות |
|------|-------------|
| **(P)** בן-אדם בלבד | ~33 |
| **(claude)** Desktop Agent | ~6 |
| **(supabase)** Console/CLI | ~5 |
| **(gcp)** Google Cloud Console | ~4 |
| **(gplay)** Play Console | ~5 |
| **(firebase)** Console | ~3 |
| **(gpt)** ChatGPT עם כלים | ~1 |
| **סה״כ שורות** | **48** |

> משימות **(co)** ו-**(co)+(P)** — ראה `CO.md` (46 משימות).
