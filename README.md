# דוג פארק - DogYard 🐾

אפליקציה חברתית לבעלי כלבים בישראל. מציאת גינות כלבים, דיווח על מפגעים והזמנת אוכל ישירות לגינה.

## פיתוח מקומי

```sh
# התקנת תלויות
npm install --legacy-peer-deps

# הרצה במצב פיתוח (דפדפן)
npm run dev
```

## בנייה לאנדרואיד (Production)

כדי לייצר גרסת אנדרואיד native, יש להריץ את הפקודות הבאות בטרמינל:

```sh
# 1. בניית קבצי ה-Web
npm run build

# 2. סנכרון הקוד לתוך פרויקט האנדרואיד
npx cap sync

# 3. פתיחת הפרויקט באנדרואיד סטודיו
npx cap open android
```

### דגשים להפצה בחנות (Google Play):
- **הרשאות מיקום**: וודאו שקובץ ה-`AndroidManifest.xml` כולל הרשאות GPS.
- **מדיניות פרטיות**: הדף זמין בכתובת `/privacy` בתוך האפליקציה.
- **חתימה**: יש לייצר Signed Bundle דרך Android Studio.

## טכנולוגיות
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase
7
---
נבנה באהבה לכלבים. 🐕
        