# Glass UX Integration — תוכנית אינטגרציה מלאה

## סקירה כללית
מסמך זה מפרט **כל שלב** הנדרש לשילוב עיצוב ה-"Neo glassy UI" בפרויקט `dogyard-atoms`, עד לרמת כפתור — כולל העברת העיצוב הישן לתיקיית ארכיב.

---

## שלב 0 — הבנת הפער (Gap Map)

| מה קיים ב-Neo UI | מה קיים כיום בפרויקט | פעולה נדרשת |
|---|---|---|
| `GlassCard.tsx` | אין | להעתיק ל-`src/components/ui/` |
| `LoadingScreen.tsx` | אין | להוסיף ל-`src/components/` |
| `Sidebar.tsx` | `Navbar.tsx` + `BottomNav` | להחליף (להעביר ישן לארכיב) |
| `HomeView.tsx` | `Index.tsx` | למזג — לוגיקה ישנה + עיצוב חדש |
| `ExploreView.tsx` | `Map.tsx` | למזג — Google Maps אמיתי + glass UI |
| `theme.css` | `src/index.css` + `tailwind.config.ts` | למזג CSS variables + glass tokens |
| `fonts.css` (Syne + DM Sans) | אין | להוסיף import לגופנים |
| `motion/react` | לא מותקן | `npm install motion` |
| background חי (Unsplash) | אין | להחליף בתמונות מקומיות/Supabase storage |
| Sidebar navigation (view-based) | Router-based navigation | לחבר ל-`react-router-dom` |
| טקסטים hardcoded באנגלית | `src/i18n/translations.ts` | לתרגם he/en ולהוסיף ל-translations |
| LTR layout בלבד | RTL ברירת מחדל | להוסיף `dir`-aware classes לכל קומפוננטה |

---

## שלב 1 — תלויות חדשות

### 1.1 התקנה
```powershell
npm install motion --legacy-peer-deps
```

### 1.2 גופנים — `src/index.css`
להוסיף בתחילת הקובץ:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
```

ובגוף:
```css
* { font-family: 'DM Sans', -apple-system, sans-serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'Syne', sans-serif; }
```

---

## שלב 2 — Glass Design System (CSS + Tailwind)

### 2.1 הוספת Glass Tokens ל-`src/index.css`
להוסיף ל-`:root`:
```css
/* Glassmorphism tokens */
--glass-light: rgba(255, 255, 255, 0.08);
--glass-medium: rgba(255, 255, 255, 0.12);
--glass-strong: rgba(255, 255, 255, 0.18);
--glass-border: rgba(255, 255, 255, 0.25);
--glass-blur: 24px;

/* Brand colors */
--background: #0a0f0d;
--foreground: #ffffff;
--primary: #10b981;
--primary-foreground: #ffffff;
--accent: #10b981;
--border: rgba(255, 255, 255, 0.15);
--input-background: rgba(255, 255, 255, 0.08);
--radius: 1.25rem;

/* Gradients */
--gradient-emerald: linear-gradient(135deg, #10b981 0%, #059669 100%);
--gradient-forest: linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%);
```

### 2.2 Scrollbar utilities ל-`src/index.css`
```css
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
```

### 2.3 עדכון `tailwind.config.ts`
להוסיף תחת `theme.extend`:
```ts
backdropBlur: { '2xl': '24px', '3xl': '40px' },
colors: {
  glass: {
    light: 'rgba(255,255,255,0.08)',
    medium: 'rgba(255,255,255,0.12)',
    strong: 'rgba(255,255,255,0.18)',
  },
  emerald: { ... } // לוודא שיש את כל גוני emerald/teal
},
boxShadow: {
  'glass': '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
  'glass-glow': '0 8px 32px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
}
```

---

## שלב 3 — קומפוננטות Glass חדשות

### 3.1 `src/components/ui/GlassCard.tsx`
להעתיק מ-`Neo glassy UI/src/app/components/GlassCard.tsx` ללא שינוי.

### 3.2 `src/components/LoadingScreen.tsx`
להעתיק מ-`Neo glassy UI/src/app/components/LoadingScreen.tsx`.
**שינויים נדרשים:**
- להחליף טקסט `"Luminous Bark"` / `"Initializing AR Experience..."` במפתחות translations:
  - `t('appName')` / `t('loadingScreen')`
- להוסיף `import { useLanguage } from '@/context/LanguageContext'`

### 3.3 `src/components/GlassSidebar.tsx`
להעתיק מ-`Neo glassy UI/src/app/components/Sidebar.tsx`, שם קובץ חדש.
**שינויים נדרשים:**
- ניווט: להחליף `onNavigate(id)` ב-`useNavigate()` מ-`react-router-dom`:
  ```tsx
  import { useNavigate, useLocation } from 'react-router-dom';
  const navigate = useNavigate();
  const location = useLocation();
  // isActive: location.pathname === item.path (במקום currentView === item.id)
  ```
- עדכון `menuItems` עם `path` תואם לרוטינג הקיים:
  ```ts
  { icon: Home,     label: t('nav.home'),     path: '/' },
  { icon: Compass,  label: t('nav.map'),      path: '/map' },
  { icon: User,     label: t('nav.profile'),  path: '/profile' },
  { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ```
- להוסיף תמיכת RTL: `className={isRTL ? 'right-0' : 'left-0'}` ל-`motion.div`
- להחליף "Garden Explorer" ו-"Level 12" בנתוני `user?.email` מ-`useAuth()`

---

## שלב 4 — עדכון `src/App.tsx`

### 4.1 הסרת Layout ישן
```tsx
// להסיר:
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav'; // אם קיים
import Footer from '@/components/Footer';
```

### 4.2 הוספת Background גלובלי + Sidebar
```tsx
import { GlassSidebar } from '@/components/GlassSidebar';
import { LoadingScreen } from '@/components/LoadingScreen';

// בתוך ה-JSX:
// 1. LoadingScreen על כל האפליקציה (רק בטעינה ראשונה)
// 2. Fixed background layer (dark + gradient)
// 3. GlassSidebar עם isOpen state
// 4. TopBar עם כפתור menu + avatar המשתמש
// 5. Ambient Effects (blur glow circles)
```

### 4.3 TopBar
להחליף את `<Navbar />` בתוכן הבא:
```tsx
<div className="fixed top-0 inset-x-0 z-30 p-4 flex items-center justify-between">
  <button onClick={() => setSidebarOpen(true)}
    className="p-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl">
    <Menu className="w-6 h-6 text-white" />
  </button>
  <div className="flex items-center gap-3">
    <div className="px-4 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full">
      <span className="text-white/90 text-sm">{cityName}</span>
    </div>
    <UserAvatarButton /> {/* לחיצה -> /profile */}
  </div>
</div>
```

### 4.4 Ambient Effects (להוסיף מחוץ ל-router):
```tsx
<div className="fixed inset-0 pointer-events-none z-20">
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
</div>
```

---

## שלב 5 — עדכון מסכים (Page by Page)

### 5.1 `src/pages/Index.tsx` (HomeView)
**מה לשמור מהקוד הישן:**
- קריאות דאטה (Supabase queries)
- ניווט ל-/map
- כל הטקסטים דרך `t()`

**מה לקחת מה-Neo UI:**
- Hero Section עם `motion` animations
- Stats bar עם `GlassCard`
- Nearby Gardens list עם `GlassCard + motion`

**שינויים נדרשים:**
- `featuredGardens`: להחליף mock data בקריאה אמיתית מ-`useNearbyGardens` + `formatGardenName`
- `stats`: להחליף mock numbers בנתונים אמיתיים (check-ins, gardens count וכו')
- כפתור "To the Garden" -> `useNavigate('/map')`
- "View All" -> `useNavigate('/map')`
- תמונות: להחליף Unsplash URLs בתמונות מ-Supabase storage
- כל הטקסטים -> `t('home.*')`

### 5.2 `src/pages/Map.tsx` (ExploreView)
**מה לשמור:**
- Google Maps rendering עם `@vis.gl/react-google-maps`
- `useNearbyGardens` RPC
- markers אמיתיים

**מה לקחת מה-Neo UI:**
- Search bar עם `GlassCard`
- Filter pills (glass style)
- Map controls (glass overlay)
- Nearby list עם `GlassCard`

**שינויים נדרשים:**
- `ExploreView` mockup map -> להשאיר Google Maps ולעטוף ב-`GlassCard`
- `gardenMarkers` mock -> להחליף ב-markers מה-hook
- `nearbyObjects` mock -> להחליף ב-`useNearbyGardens` data + `formatGardenName`
- search input -> סינון על הנתונים הקיימים
- Camera button (AR) -> להשאיר כ-CTA אך להוציא ל-phase 2 אם AR לא מוכן
- כל labels -> `t('map.*')`

### 5.3 `src/pages/GardenDetails.tsx`
**שינוי עיצובי:**
- לעטוף sections ב-`GlassCard`
- background: תמונת הגינה עם overlay gradient

### 5.4 `src/pages/Auth.tsx`
**שינוי עיצובי:**
- טפסים עם `GlassCard` wrapping
- inputs עם `bg-white/10 backdrop-blur` style
- כפתורים עם `bg-gradient-to-r from-emerald-500 to-emerald-600`

### 5.5 `src/pages/Profile.tsx`
**שינוי עיצובי:**
- sections עם `GlassCard`
- avatar עם glass ring
- dog cards עם `GlassCard intensity="light" glow`

### 5.6 שאר עמודים (Settings, AdminImport, AdminGardens)
- לעטוף את כל cards/panels ב-`GlassCard`
- לעדכן כפתורים לסגנון emerald gradient

---

## שלב 6 — ארכיב העיצוב הישן

### 6.1 יצירת תיקיית ארכיב
```powershell
New-Item -ItemType Directory -Path "C:\Users\user\StudioProjects\dogyard-atoms\src\components\legacy-ui"
```

### 6.2 קבצים להעביר ל-`src/components/legacy-ui/`:
| קובץ | הערה |
|---|---|
| `src/components/Navbar.tsx` | מוחלף ע"י TopBar בתוך App.tsx |
| `src/components/Footer.tsx` | מוחלף ע"י Sidebar |
| `src/components/HeroSection.tsx` | מוחלף ע"י HomeView |
| `src/components/CommunitySection.tsx` | להעריך אם נשמר |
| `src/components/FeaturesGrid.tsx` | להעריך אם נשמר |
| `src/App.css` | לאחר מיזוג ל-`index.css` |

> **חשוב:** להשאיר את כל הקבצים בתיקיית `legacy-ui/` — לא למחוק — עד לאחר אימות מלא.

---

## שלב 7 — RTL / i18n לכל קומפוננטה Glass

### 7.1 עקרון RTL ב-Glass
- Sidebar: ב-RTL נפתח מימין. לשנות:
  ```tsx
  initial={{ x: isRTL ? '100%' : '-100%' }}
  animate={{ x: isOpen ? 0 : (isRTL ? '100%' : '-100%') }}
  className={`fixed top-0 h-full w-80 z-50 ${isRTL ? 'right-0' : 'left-0'}`}
  ```
- TopBar: כפתור menu ב-RTL יהיה מימין.
- כל `flex` עם `gap`: לבדוק שאין `gap-X direction-sensitive` שבורים.

### 7.2 מפתחות translations חדשים להוסיף ל-`src/i18n/translations.ts`
```ts
// he:
appName: 'דוגיארד',
loadingScreen: 'טוען...',
nav: { home: 'בית', map: 'מפה', profile: 'פרופיל', settings: 'הגדרות' },
home: {
  nearbyGardens: 'גינות קרובות',
  viewAll: 'הצג הכל',
  toTheGarden: 'לגינה',
  gardensVisited: 'גינות שביקרתי',
},
map: {
  search: 'חפש גינות, מיקומים...',
  all: 'הכל',
  nearby: 'קרובים',
  noResults: 'לא נמצאו תוצאות',
},

// en:
appName: 'Dogyard',
loadingScreen: 'Loading...',
// ...
```

---

## שלב 8 — חיבור דאטה אמיתי (Data Wiring)

| קומפוננטה | Mock קיים | החלפה ב |
|---|---|---|
| HomeView — "Nearby Gardens" | `featuredGardens` array | `useNearbyGardens(userLat, userLng, 2000)` + `formatGardenName` |
| HomeView — Stats | numbers hardcoded | queries על `check_ins`, `gardens` |
| ExploreView — markers | `gardenMarkers` array | `useGardens()` + לחישוב `lat/lng` אחוזיים בתוך map container |
| ExploreView — Nearby Objects | mock | `useNearbyGardens` |
| Sidebar — User info | "Garden Explorer / Level 12" | `user.email` / `profile.display_name` מ-`useAuth()` |
| TopBar — city label | `"Tel Aviv"` hardcoded | GPS / `useNearestShalter` location או settings |

---

## שלב 9 — Package.json + תלויות חדשות

| חבילה | למה | פעולה |
|---|---|---|
| `motion` | אנימציות Neo UI | `npm install motion --legacy-peer-deps` |
| `@vis.gl/react-google-maps` | קיים | לא לגעת |
| `framer-motion` | בדוק אם כבר קיים (motion היא הגרסה החדשה) | `npm ls framer-motion` |

---

## שלב 10 — בדיקות לאחר אינטגרציה

```powershell
npm test
npm run build
```

| תחום | מה לבדוק |
|---|---|
| RTL | Sidebar נפתח מימין ב-he, כפתורים/טקסטים מיושרים נכון |
| Auth | LoginScreen עם Glass style, callback חוזר נכון |
| Map | Google Maps מוצג עם Glass overlay, markers אמיתיים |
| Profile | פרופיל + כלבים מוצגים ב-GlassCard |
| Loading | LoadingScreen מופיע רק פעם אחת בטעינה ראשונה |
| Android | מסך הרחבה נכון, backdrop-blur תמיכה ב-WebView |

---

## סדר ביצוע מומלץ (Recommended Execution Order)

```
1. התקן dependencies (motion)
2. הוסף CSS tokens + fonts לsrc/index.css
3. העתק GlassCard -> src/components/ui/
4. העתק LoadingScreen -> src/components/
5. צור GlassSidebar עם router integration
6. עדכן src/App.tsx (background, TopBar, Sidebar, LoadingScreen)
7. עדכן Index.tsx (HomeView) - עיצוב בלבד, דאטה קיים
8. עדכן Map.tsx (ExploreView) - glass overlay על Google Maps
9. עדכן שאר עמודים (GardenDetails, Auth, Profile)
10. הוסף translations חדשים
11. העבר קבצים ישנים ל-legacy-ui/
12. הרץ tests + build
13. בדיקה ידנית ב-RTL + Android
```

---

## נספח — קבצים מה-Neo UI שלא דורשים שינוי בפרויקט

- `src/app/components/ARScanner.tsx` — פיצ'ר AR עתידי, אין אינטגרציה בשלב זה
- `src/app/components/figma/ImageWithFallback.tsx` — שמיש, להעביר אם נדרש
- כל קבצי `src/app/components/ui/*.tsx` — כבר קיימים בפרויקט (shadcn), אין לדרוס

