# השלמת סודות AAB - סיכום ביצוע

**תאריך:** April 12, 2026  
**ביצע:** GitHub Copilot  
**סטטוס:** ⏸️ מושהה — ממתין לסודות חתימה

---

## מה בוצע ✅

### משימה 1 — עדכון versionName ✅ הושלם
**קובץ:** `android/app/build.gradle`

```groovy
// לפני
versionCode 1
versionName "1.0"

// אחרי
versionCode 1
versionName "1.0.0"
```

---

## מה ממתין ⏸️

### משימה 2 — הגדרת signing credentials ❌ חסר
הbuild.gradle מוגדר לקבל signing credentials ב-4 משתנים:

```groovy
def releaseStoreFilePath = resolveBuildSecret('DOGYARD_KEYSTORE_PATH', 'DOGYARD_KEYSTORE_PATH')
def releaseStorePassword = resolveBuildSecret('DOGYARD_KEYSTORE_PASSWORD', 'DOGYARD_KEYSTORE_PASSWORD')
def releaseKeyAlias      = resolveBuildSecret('DOGYARD_KEY_ALIAS', 'DOGYARD_KEY_ALIAS')
def releaseKeyPassword   = resolveBuildSecret('DOGYARD_KEY_PASSWORD', 'DOGYARD_KEY_PASSWORD')
```

**Keystore קיים:**  
- ✅ `dogyard.keystore` קיים ב-root הפרויקט (2,722 bytes)

**חסר:**

| משתנה | סטטוס |
|---|---|
| `DOGYARD_KEYSTORE_PATH` | ❌ לא מוגדר |
| `DOGYARD_KEYSTORE_PASSWORD` | ❌ לא ידוע |
| `DOGYARD_KEY_ALIAS` | ❌ לא ידוע |
| `DOGYARD_KEY_PASSWORD` | ❌ לא ידוע |

---

### משימה 3 — בניית AAB ❌ חסום
לא ניתן לבנות AAB חתום ב-production keystore ללא הסודות.

---

## כיצד להשלים ▶️

### שלב 1 — מצא את הסודות

המקומות הסבירים:
- Password Manager / Vault של הצוות
- GitHub Secrets → `Settings → Secrets → Actions`
- Android Studio: `Build → Generate Signed Bundle/APK → Key Store Path`
- איש DevOps / מי שיצר את ה-keystore

### שלב 2 — הגדר את הסודות ב-`android/local.properties`

פתח את `android/local.properties` והוסף בסוף הקובץ:

```properties
DOGYARD_KEYSTORE_PATH=C:\\Users\\user\\StudioProjects\\dogyard-atoms\\dogyard.keystore
DOGYARD_KEYSTORE_PASSWORD=<הסיסמה שלך>
DOGYARD_KEY_ALIAS=<ה-alias שלך>
DOGYARD_KEY_PASSWORD=<סיסמת ה-key שלך>
```

> ⚠️ **אזהרה:** אל תעלה קובץ זה ל-Git! הוא כבר ב-.gitignore

### שלב 3 — בנה את ה-AAB

```powershell
cd C:\Users\user\StudioProjects\dogyard-atoms

# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Build Release AAB
cd android
./gradlew clean bundleRelease
```

### שלב 4 — אמת את הפלט

```powershell
Test-Path "app\build\outputs\bundle\release\app-release.aab"
Get-Item "app\build\outputs\bundle\release\app-release.aab" | Select-Object FullName, Length, LastWriteTime
```

**תוצאה צפויה:**
```
FullName  : ...\app-release.aab
Length    : ~30-50 MB
LastWriteTime : 12/04/2026 ...
```

### שלב 5 — Upload לGoogle Play Console

1. הכנס ל-[Google Play Console](https://play.google.com/console)
2. בחר את אפליקציית DogYard
3. **Release → Production → Create new release**
4. העלה את `app-release.aab`
5. השלם את פרטי ה-store listing

---

## בדיקת קיום AAB לאחר build

```powershell
# הרץ אחרי השלמת שלב 3
cd "C:\Users\user\StudioProjects\dogyard-atoms"
Get-ChildItem -Path "android\app\build\outputs" -Recurse -Filter "*.aab" | Select-Object FullName, Length, LastWriteTime
```

---

## ⚠️ אם שכחת את הסיסמה של ה-keystore

**חשוב מאוד:**  
אם אי פעם מפורסמת גרסה עם keystore מסוים ב-Play Store — **אסור ליצור keystore חדש**.  
זה יגרום לדחייה מGoogle Play וצורך להעלות אפליקציה חדשה לחלוטין עם bundle ID חדש.

אם זו **גרסה ראשונה שטרם פורסמה** — ניתן ליצור keystore חדש:

```powershell
# יצירת keystore חדש (רק אם אין גרסה קיימת בחנות!)
$jdkHome = "C:\Users\user\AppData\Local\Android\Sdk\..\jdk\bin"
$jre = Get-ChildItem "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -ErrorAction SilentlyContinue

if ($jre) {
    & $jre.FullName -genkey -v `
      -keystore "C:\Users\user\StudioProjects\dogyard-atoms\dogyard-new.keystore" `
      -alias dogyard-release `
      -keyalg RSA `
      -keysize 2048 `
      -validity 10000
}
```

---

## סיכום מצב

| משימה | סטטוס | פעולה נדרשת |
|---|---|---|
| עדכון `versionName` ל-`1.0.0` | ✅ הושלם | — |
| הגדרת signing credentials | ⏸️ ממתין | מצא ב-password manager |
| בניית `app-release.aab` | ⏸️ ממתין | לאחר השלמת signing |
| Upload לGoogle Play | ⏸️ ממתין | לאחר AAB מוכן |

---

**יוצר המסמך:** GitHub Copilot  
**עדכון אחרון:** April 12, 2026

