# Rollback Runbook (MAIN Release)

## מטרת המסמך
החזרת גרסה יציבה במהירות במקרה של תקלה בייצור.

## טריגרים ל-Rollback
- crash rate גבוה מהסף שהוגדר
- כשל התחברות (Auth) נרחב
- כשל תפקודי בליבת המוצר (Map/Check-in/Profile)
- חשיפת אבטחה פעילה

## שלבים עיקריים לביצוע Rollback (סיכום תמציתי)

1. עצור rollout בחנות (Play Console) — מנע המשך הפצה לגרסה הבעייתית.
2. אתר את הגרסה היציבה האחרונה (AAB/commit SHA) — שמור מזהה ברור.
3. פרסם fallback release — העלה את ה-AAB הישן או בצע revert ב-main והפעל build מחדש.
4. אמת smoke test ידני על הגרסה הישנה (לפני פתיחה מחודשת של rollout).
5. פתח incident ותעד timeline — כולל root cause, פעולות, ותוצאות.
6. אם בוצעה מיגרציה DB: אל תריץ rollback אוטומטי! בצע תיקון forward או rollback רק עם גיבוי מאומת.
7. עדכן סטטוס פנימי כל 30 דקות ועדכן משתמשים אם יש צורך.
8. סיים את האירוע רק לאחר שה-crash/error חזרו לערכי baseline, smoke pass, ואישור Go מחדש.

### הערות חשובות
- אין לבצע rollback סכימה/DB ללא גיבוי מלא.
- כל שינוי RLS/policies דורש אימות ידני.
- מומלץ לשמור תיעוד incident ב-copilot/POST_MORTEM_TEMPLATE.md.

## שלבים
1. עצירת rollout בחנות (Play Console)
2. זיהוי גרסה יציבה אחרונה (AAB + commit SHA)
3. פרסום fallback release
4. אימות smoke ידני על fallback
5. פתיחת incident ותיעוד timeline

## DB / Supabase
- אין להריץ rollback סכימה ללא גיבוי מאומת
- במקרה מיגרציה בעייתית: לבצע תיקון forward אלא אם יש תוכנית downgrade מאומתת
- לאמת RLS/policies לאחר כל פעולה מתקנת

## תקשורת
- עדכון סטטוס פנימי: כל 30 דקות
- עדכון משתמשים (אם נדרש): תקלה ידועה + ETA

## יציאה מהאירוע
- crash/error חוזר לערכי baseline
- smoke pass על הפיצ'רים הקריטיים
- אישור Go מחדש ע"י owner
