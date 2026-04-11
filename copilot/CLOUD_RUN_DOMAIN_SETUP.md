# קישור דומיין מותאם ל-Cloud Run

## הגדרות נוכחיות
- **app-1**: https://app-1-178991261714.us-central1.run.app
- **app-2**: https://app-2-178991261714.us-central1.run.app

---

## איך מקשרים דומיין משלך

### דרישות מוקדמות
1. יש לך דומיין רשום (לדוגמה: `dogyard.app` / `dogyard.co.il`)
2. יש לך גישה לניהול ה-DNS של הדומיין

### שלב 1 — אמת בעלות על הדומיין ב-Google Search Console
```
https://search.google.com/search-console
```
הוסף את הדומיין שלך ועקוב אחר הוראות האימות (TXT record ב-DNS).

### שלב 2 — מיפוי ל-Cloud Run

```powershell
# החלף YOURDOMAIN.COM בדומיין שלך
gcloud run domain-mappings create `
  --service app-1 `
  --domain app1.YOURDOMAIN.COM `
  --project g050426

gcloud run domain-mappings create `
  --service app-2 `
  --domain app2.YOURDOMAIN.COM `
  --project g050426
```

### שלב 3 — עדכן DNS
אחרי שתריץ את הפקודות, תקבל רשומות DNS להוסיף:
```powershell
gcloud run domain-mappings describe `
  --domain app1.YOURDOMAIN.COM `
  --project g050426
```

הוסף את רשומות ה-CNAME/A שמוחזרות לספק ה-DNS שלך.
SSL נוצר אוטומטית ע"י Google תוך מספר דקות.

### שלב 4 — בדיקה
```powershell
curl -I https://app1.YOURDOMAIN.COM
curl -I https://app2.YOURDOMAIN.COM
```

---

## דומיין אחד — שירות אחד (הפשוט ביותר)
אם תרצה שהשם הראשי (`dogyard.app`) יצביע על `app-1`:
```powershell
gcloud run domain-mappings create `
  --service app-1 `
  --domain dogyard.app `
  --project g050426
```

