# Decisions & Lessons Learned (Release Prep)

## Decisions
- Docker runtime הוקשח עם non-root + healthcheck + template nginx.
- `compose.yaml` יושר לתחביר תקין והפרדת `ports` מ-`build.args`.
- הוספת תמיכה ב-`VITE_DEVELOPER_EMAILS`/`VITE_DEVELOPER_EMAIL` ב-build args.
- RLS/policies אומתו במיגרציות עבור טבלאות הליבה.

## Lessons Learned
- בדיקות coverage דורשות התקנת `@vitest/coverage-v8` מראש כדי למנוע תקיעת prompt.
- רצוי להריץ בדיקות Docker/Gradle בסשן טרמינל נקי כדי להימנע ממצב אינטראקטיבי תלוי.
- יש להשאיר קבצי release governance ב-`copilot/` כדי לזרז handoff.

## Follow-ups
- לשדרג/לתקן תלות עם CVEs גבוהים (`react-router-dom`, `vite-plugin-pwa` chain).
- להשלים אימות AAB release חתום בסביבת הפצה.
- לחזק headers ב-nginx (CSP/HSTS לפי ארכיטקטורת פריסה).

