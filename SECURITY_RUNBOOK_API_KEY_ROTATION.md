# 🔐 Security Runbook: API Key Rotation

**סיבוב מפתחות ה-API החשופים בדוקר**

**תאריך חשיפה:** April 10, 2026  
**מפתחות חשופים:** 
- `VITE_SUPABASE_ANON_KEY` (JWT token)
- `VITE_GOOGLE_MAPS_API_KEY` (Google Maps API key)

---

## 🚨 Priority: HIGH
שני המפתחות נחשפו ב-Docker build context. יש לסובב אותם בדחיפות כדי למנוע שימוש זדוני.

---

## שלב 1: Supabase Anon Key Rotation ✅

### מה צריך לעשות:
ה-`VITE_SUPABASE_ANON_KEY` משמש ל**authentication** בתוך האפליקציה. אם הוא נחשף, כל אחד יכול לגשת לדטה דרך Supabase RLS policies.

### הוראות:

#### א) כנס לדשבורד Supabase
1. בקר ב: https://supabase.com/dashboard
2. בחר את הפרויקט שלך

#### ב) מצא את ה-Anon Key הנוכחי
1. עבור ל: **Project Settings** → **API**
2. חיפוש אחרי **anon public** key
3. **עתיד**: צא מהעמוד (לא תעתיק אותו עדיין)

#### ג) צור API key חדש
1. בעמוד API, לחץ **Generate New Key** (אם קיים כפתור כזה)
   - אם לא קיים, תצטרך לעבור ל: **Project Settings** → **Database** → **Rotate Key**
2. בחר **anon** token type
3. **שמור את המפתח החדש בטמפ פייל בטוח** (לא קליפבורד ישיר)

#### ד) ודא שהפרויקט עדיין עובד
- בטוח שה-RLS policies על הטבלאות מורשות לשימוש anon key (לבדוק ב-Supabase SQL Editor)
- טבלאות עיקריות: `gardens`, `garden_details`, `imports_log` - צריכות להיות accessible

#### ה) עדכן את `.env.local`
```bash
# החלף את:
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# עם המפתח החדש:
VITE_SUPABASE_ANON_KEY=<NEW_ANON_KEY_HERE>
```

---

## שלב 2: Google Maps API Key Rotation ✅

### מה צריך לעשות:
ה-`VITE_GOOGLE_MAPS_API_KEY` משמש ל**Maps JavaScript API** ו**Places API**. אם נחשף, אדם זדוני יכול:
- לתקוף את ה-API (DDoS)
- להשתמש בו באתרים לא מורשים
- לגרום לחיובים חסרים

### הוראות:

#### א) כנס ל-Google Cloud Console
1. בקר ב: https://console.cloud.google.com
2. בחר את הפרויקט הנכון (דוג'ארד)

#### ב) מצא את ה-API Key הנוכחי
1. עבור ל: **APIs & Services** → **Credentials**
2. חיפוש אחר **API Key** (תרשה מסוג זה)
3. לחץ על ה-key הנחשף

#### ג) הגבל את ה-key הישן (בינתיים)
1. בעמוד הפרטים של ה-key:
   - **לא תמחק אותו עדיין!** (כי אתה אולי עדיין משתמש בו)
2. לחץ **Edit**
3. בקטע **Application restrictions**:
   - בחר **HTTP referrers (web sites)**
   - בתוך **Referrer** הוסף: `127.0.0.1:0/32` (להגביל לכתובת "עקרונית" בלבד)
4. **שמור** - זה ימנע שימוש זדוני

#### ד) צור API Key חדש
1. חזור ל: **APIs & Services** → **Credentials**
2. לחץ **+ Create Credentials** → **API Key**
3. בחזקה חדשה שנוצרה:
   - לחץ **Edit**
   - הגדר **Application restrictions** → **HTTP referrers (web sites)**
   - הוסף את ה-referrers הנכונים:
     ```
     http://localhost:8080/*
     http://127.0.0.1:8080/*
     http://localhost:8082/*
     https://your-production-domain.com/*
     ```
   - לחץ **Save**
4. **עתיד את ה-key החדש לטמפ פייל בטוח**

#### ה) ודא שה-APIs מאופשרות
בעמוד **APIs & Services** → **Enabled APIs**, וודא:
- ✅ **Maps JavaScript API** - enabled
- ✅ **Places API** - enabled
- ✅ **Places API (New)** - enabled (אם קיימת)

אם לא מאופשרות, לחץ **+ Enable APIs and Services** וחפש כל אחת

#### ו) עדכן את `.env.local`
```bash
# החלף את:
# VITE_GOOGLE_MAPS_API_KEY=AIza_YOUR_KEY_HERE

# עם המפתח החדש:
VITE_GOOGLE_MAPS_API_KEY=<NEW_GOOGLE_MAPS_KEY_HERE>
```

---

## שלב 3: אימות מקומי 🧪

### בדוק שהשינויים עובדים:

#### א) ניקוי וביצוע בנייה מחדש
```powershell
# בטוח שאתה בשורש הפרויקט
cd C:\Users\user\StudioProjects\dogyard-atoms

# מחק את node_modules כדי להימנע מ-cache
Remove-Item -Recurse -Force node_modules

# התקן dependencies מחדש
npm install --legacy-peer-deps
```

#### ב) רץ את השרת בפיתוח
```powershell
npm run dev
```
- פתח את `http://localhost:8080` בדפדפן
- בדוק שה-Map עוגן ולא מצביע שגיאה (places חייבות להיות שנטענו)
- בדוק שהכניסה (login) עובדת

#### ג) בדוק את בנייית Docker
```powershell
# בדוק שה-.env.local מכיל את המפתחות החדשים
type .env.local | Select-String "VITE_SUPABASE_ANON_KEY|VITE_GOOGLE_MAPS_API_KEY"

# בנה את ה-image של Docker
docker compose build

# הרץ את הקונטיינר
docker compose up -d

# בדוק תיקייה
docker compose logs app -f
```

---

## שלב 4: ניקוי וביטול old keys (אחרי וידואו הצלחה)

### מחיקת ה-keys הישנים (רק אחרי 24-48 שעות של תצפיות)

#### Google Maps Key הישן:
1. חזור ל: **Google Cloud Console** → **APIs & Services** → **Credentials**
2. מצא את ה-key הישן (עם ה-referrer המוגבל `127.0.0.1:0/32`)
3. לחץ **Delete** בפעולה בעצמו
4. אישור המחיקה

#### Supabase Anon Key הישן:
1. בדשבורד Supabase, עבור ל: **Project Settings** → **API**
2. לחץ **Rotate** או **Revoke** על ה-key הישן
3. אישור המחיקה

---

## שלב 5: צור `.env.example` מעודכן 📄

כדי למנוע חשיפה קדימה, עדכן את `src/.env.example` או `.env.local.example`:

```bash
# Local-only env file for Docker Compose.
# This file is ignored by git (.gitignore).
# IMPORTANT: Fill in your actual values below before running docker compose or npm run dev

# ============================================================
# Supabase — REQUIRED
# ============================================================
# Get these from Supabase Dashboard → Project Settings → API
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY_HERE
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # ⚠️ ROTATED - GET NEW KEY

# ============================================================
# Google Maps — REQUIRED for map features
# ============================================================
# Get this from Google Cloud Console → APIs & Services → Credentials
# IMPORTANT: Must enable:
#   1. Maps JavaScript API
#   2. Places API
#   3. Places API (New)
# Restrict by: Websites (HTTP referrers)
# Referrers: localhost:8080, localhost:8082, 127.0.0.1:*, your-domain.com
VITE_GOOGLE_MAPS_API_KEY=AIza_YOUR_KEY_HERE # ⚠️ ROTATED - GET NEW KEY

# ============================================================
# Admin Access — OPTIONAL
# ============================================================
# Get UUID from Supabase → Authentication → Users
VITE_ADMIN_USER_ID=YOUR_USER_UUID_HERE
VITE_ADMIN_EMAIL=your-admin@email.com
```

---

## ✅ Checklist סיום

- [ ] נוצר Supabase Anon Key חדש ו-saved בטמפ בטוח
- [ ] הוגבל ה-Google Maps Key הישן (referrer: `127.0.0.1:0/32`)
- [ ] נוצר Google Maps API Key חדש
- [ ] עדכנתי את `.env.local` עם שני המפתחות החדשים
- [ ] בחנתי את `npm run dev` - Map and Login עובדים
- [ ] בחנתי `docker compose build && docker compose up` - אין שגיאות
- [ ] הגדרתי alert/monitoring כדי לוודא לא יהיה שימוש בـ-old keys (Google Cloud, Supabase monitoring)
- [ ] מחקתי את ה-keys הישנים (48 שעות אחרי בדיקה)

---

## 🚨 Emergency Contacts
אם יש סימנים של חדירה:
- **Google Cloud**: בדוק את ה-audit logs → **Activity** tab
- **Supabase**: בדוק את ה-logs → **Logs** explorer (search for errors/unauthorized requests)
- פנה למנהל הענן שלך לבדיקת DDoS/billing anomalies

---

**מכל ההכבד! סיבוב מפתחות בדחיפות מנע סכנה גדולה.** 🛡️

