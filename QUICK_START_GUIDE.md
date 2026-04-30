# 🐾 DogYard Project - Quick Start Guide

**Your comprehensive guide to understanding and working with the DogYard codebase**

---

## 📋 What is DogYard?

**DogYard** is a social mobile app for dog owners in Israel that helps them:
- 🗺️ **Discover dog parks** (gardens) on an interactive map
- 📍 **Share locations** with other dog lovers
- 📊 **Track peak hours** (when gardens are busiest)
- 🐕 **Connect with the community** through check-ins and reviews
- 🚨 **Report hazards** and safety concerns
- 🍔 **Order food delivery** directly to garden locations
- 🛡️ **Access emergency shelters** (ממ"דים) during crises

**Stack**: React 18 + TypeScript + Vite + Capacitor (Android) + Supabase (Backend)  
**Status**: MVP active development (April 2026)  
**Languages**: Hebrew (default, RTL) + English

---

## 🎯 Project Structure at a Glance

```
dogyard-atoms/
├─ src/                    ← Frontend React code (122 TS/TSX files)
│  ├─ pages/              (17 pages: Map, Auth, Admin, etc.)
│  ├─ components/         (76+ UI components)
│  ├─ hooks/              (9 custom hooks for data & state)
│  ├─ context/            (LanguageContext for bilingual)
│  ├─ i18n/               (Hebrew/English translations)
│  ├─ integrations/       (Supabase client setup)
│  ├─ App.tsx             (Main router & layout)
│  └─ main.tsx            (Entry point)
│
├─ supabase/              ← Backend configuration
│  └─ migrations/         (9 SQL migration files)
│
├─ android/               ← Mobile wrapper
│  └─ app/                (Gradle-based Android app)
│
├─ public/                (Static assets)
├─ package.json           (57 prod + 24 dev dependencies)
├─ vite.config.ts         (Web build config)
├─ capacitor.config.ts    (Mobile wrapper config)
├─ tsconfig.json          (TypeScript config)
├─ tailwind.config.ts     (CSS styling config)
└─ docs/                  (This documentation!)
   ├─ PROJECT_ANALYSIS.md        ← Full architecture guide
   ├─ TECHNICAL_REFERENCE.md     ← System diagrams & patterns
   ├─ CODEBASE_STATS.md          ← Metrics & health score
   └─ QUICK_START_GUIDE.md       ← You are here!
```

---

## 🚀 Getting Started (5 minutes)

### 1. **Clone & Install**
```bash
# Clone the repo
git clone <repo-url> dogyard-atoms
cd dogyard-atoms

# Install dependencies
npm install --legacy-peer-deps
```

### 2. **Set up Environment**
```bash
# Copy template and fill with your values
cp .env.example .env

# Edit .env with:
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=xxxxx
VITE_GOOGLE_MAPS_API_KEY=xxxxx
```

### 3. **Run Locally**
```bash
# Start dev server (browser)
npm run dev

# Open http://localhost:8080
```

### 4. **Run on Android**
```bash
# Build & sync
npm run build
npx cap sync android

# Open in Android Studio or run on device
npx cap open android
# OR quick launch
npm run play
```

---

## 🗂️ Where to Find Things

| Task | Location | Key Files |
|------|----------|-----------|
| **Add a page** | `src/pages/` | Register route in `src/App.tsx` |
| **Create component** | `src/components/` | Import in page or other components |
| **Add API logic** | `src/hooks/` | Use Supabase client directly |
| **Change text** | `src/i18n/translations.ts` | Single source for all labels |
| **Style with Tailwind** | `tailwind.config.ts` | Extend colors, spacing, etc. |
| **Modify database** | `supabase/migrations/` | Create new migration file |
| **Add user route** | `src/App.tsx` | Route definition |
| **Protect route** | `src/components/ProtectedRoute.tsx` | Auth guard HOC |
| **Check admin access** | `src/hooks/useDeveloperAccess.ts` | Admin gating logic |
| **Manage mobile config** | `capacitor.config.ts` | Capacitor setup |
| **Build settings** | `vite.config.ts` | Vite configuration |

---

## 📖 Core Concepts

### 1. **Bilingual & RTL Support**
- Default language: **Hebrew** (RTL - right-to-left)
- Alternative: **English** (LTR - left-to-right)
- Managed by `LanguageContext` at `src/context/LanguageContext.tsx`
- All text in `src/i18n/translations.ts`

```typescript
// Usage in component:
const { t, isRTL } = useLanguage();
<h1>{t.appName}</h1>  // "דוג יארד"
<div dir={isRTL ? 'rtl' : 'ltr'}>...</div>
```

### 2. **Authentication**
- **Method**: Supabase magic link (email-based)
- **Flow**: PKCE (Proof Key for Code Exchange)
- **Storage**: localStorage (browser), session persistence enabled
- **Deep-link**: Mobile auth callback via Capacitor `appUrlOpen`

```typescript
// Usage in component:
const { user, isLoading } = useAuth();
if (!user) return <Auth />;
```

### 3. **Protected Routes**
- Routes wrapped with `ProtectedRoute` require authentication
- Admin routes additionally gated by `useDeveloperAccess()`
- Admin gating: deny-by-default (env vars: `VITE_ADMIN_USER_ID` or `VITE_ADMIN_EMAIL`)
- Feature flags: `VITE_ENABLE_ADMIN_ROUTES`, `VITE_ENABLE_DOG_SHARE_ROUTE`

```typescript
// In App.tsx:
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/admin/gardens" element={<ProtectedRoute><AdminGardens /></ProtectedRoute>} />
```

### 4. **Data Access (Supabase)**
- **Direct client calls**: No backend API layer (Supabase client in browser)
- **RLS Policies**: Row-level security enforced in database
- **Caching**: React Query for automatic cache management
- **Mutations**: React Query `useMutation()` for create/update/delete

```typescript
// Usage in hook:
const { data: gardens } = useQuery({
  queryKey: ['gardens'],
  queryFn: async () => {
    const { data } = await supabase.from('gardens').select();
    return data;
  },
});
```

### 5. **Garden Moderation Flow**
- Users or admins can submit new gardens
- Submitted gardens get `status: 'pending'`
- Admin approval via `/admin/gardens` dashboard
- Once approved (`status: 'approved'`), visible to all users

---

## 🔧 Common Tasks

### Add a New Garden Page Section
```typescript
// 1. Create component: src/components/GardenNewFeature.tsx
export function GardenNewFeature({ gardenId }) {
  const { data: garden } = useGardens();
  return <div>New feature...</div>;
}

// 2. Add to page: src/pages/GardenDetails.tsx
import { GardenNewFeature } from "@/components/GardenNewFeature";
export default function GardenDetails() {
  return (
    <>
      {/* existing sections */}
      <GardenNewFeature gardenId={id} />
    </>
  );
}
```

### Add a New Translation
```typescript
// 1. Edit src/i18n/translations.ts
export const translations = {
  he: {
    appName: "דוג יארד",
    myNewKey: "טקסט חדש בעברית",
    // ...
  },
  en: {
    appName: "DogYard",
    myNewKey: "New text in English",
    // ...
  }
};

// 2. Use in component
const { t } = useLanguage();
<h1>{t.myNewKey}</h1>
```

### Query Gardens Near User
```typescript
// In a hook or component:
const { nearbyGardens } = useGardens();

const nearby = await nearbyGardens(
  userLat,
  userLng,
  radiusInKm
);
```

### Create Admin Endpoint
```typescript
// 1. Add RLS policy in Supabase migration
CREATE POLICY "Only admins can do X"
ON public.my_table FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

// 2. In component/hook, check access first
const { canAccess } = useDeveloperAccess();
if (!canAccess) return <AccessDenied />;

// 3. Call Supabase with proper auth
await supabase.from('my_table').update(data).eq('id', id);
```

---

## 🐛 Debugging

### Check Auth Status
```javascript
// In browser console:
const { data } = await supabase.auth.getSession();
console.log(data.session?.user);
```

### View Supabase Logs
- Login to Supabase dashboard
- Project → Logs → Auth / Database
- Search for errors or specific queries

### Android Debug Logs
```bash
adb logcat | grep -i "dogyard\|capacitor"
```

### Network Requests
- Browser DevTools → Network tab
- Check requests to `supabase.co`
- Verify response status & data

---

## ✅ Quality Assurance

### Pre-Launch Checklist
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run tests
npm test

# 3. Build for production
npm run build

# 4. Validate routes
npm run qa:routes

# 5. Verify Android Firebase config
npm run verify:android:firebase

# 6. Manual testing
npm run dev
# Test all routes, auth flow, mobile responsiveness
```

### Run Tests
```bash
npm test                 # Single run
npm run test:watch      # Watch mode
npm test -- --ui        # Visual UI
npm test -- --coverage  # Coverage report
```

---

## 📱 Mobile Specific

### Android Development
```bash
# Setup
npx cap add android     # (only first time)

# Dev with hot reload
export CAPACITOR_ANDROID_SERVER_URL="http://192.168.1.10:8080"
npx cap sync android
npm run dev             # in another terminal

# Open in Android Studio
npx cap open android

# Quick launch on connected device
npm run play

# Build for Play Store
npm run build
cd android && ./gradlew bundleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### Environment Variables for Mobile
```env
# Dev server bridging
CAPACITOR_ANDROID_SERVER_URL=http://192.168.1.10:8080

# Or in capacitor.config.ts
server: {
  url: "http://192.168.1.10:8080",
  cleartext: true,
}
```

---

## 🔒 Security & Secrets

### ✅ Do's
- ✅ Keep `.env` in `.gitignore`
- ✅ Use feature flags for sensitive routes
- ✅ Check admin access via `useDeveloperAccess()`
- ✅ Validate input on critical paths
- ✅ Use Supabase RLS policies for data protection

### ❌ Don'ts
- ❌ Don't commit `.env` with real keys
- ❌ Don't hardcode API keys in source code
- ❌ Don't skip admin access checks
- ❌ Don't disable RLS policies
- ❌ Don't store keystore passwords in Git

---

## 🆘 Troubleshooting

### Issue: "Module not found: @/..."
**Solution**: Check `tsconfig.json` paths alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: "Supabase connection failed"
**Solution**: Verify `.env`:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Issue: "Android build fails"
**Solution**: Clean build:
```bash
cd android && ./gradlew clean && cd ..
npm run build && npm run play
```

### Issue: "Mobile auth not working"
**Solution**: Check deep-link config:
```tsx
// App.tsx should handle appUrlOpen
CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
  const { data } = await supabase.auth.getSessionFromUrl({ url });
  // ...
});
```

---

## 📚 Documentation Hierarchy

Start with → **Continue with** → **Deep dive into**

```
🟡 QUICK_START_GUIDE (You are here)
   ↓
🔵 PROJECT_ANALYSIS.md
   - Full architecture
   - All pages & hooks
   - Database schema
   - Development workflows
   ↓
🟣 TECHNICAL_REFERENCE.md
   - System architecture diagram
   - Component hierarchy
   - Data flow patterns
   - RLS policy examples
   ↓
🟢 CODEBASE_STATS.md
   - Metrics & health score
   - Dependencies breakdown
   - Performance baseline
   - Security audit trail
```

---

## 💡 Tips & Best Practices

### Component Patterns
```typescript
// ✅ Good: Small, focused component
function GardenCard({ garden }: { garden: Garden }) {
  return (
    <div className="p-4 rounded-lg">
      <h3>{garden.name}</h3>
      <p>{garden.location}</p>
    </div>
  );
}

// ❌ Avoid: Too large, mixed concerns
function Page() {
  // ... 500 lines of mixed logic
}
```

### Hook Patterns
```typescript
// ✅ Good: Clear responsibility
function useGardenData(id: string) {
  return useQuery({
    queryKey: ['gardens', id],
    queryFn: () => supabase.from('gardens').select().eq('id', id),
  });
}

// ❌ Avoid: Hook doing too much
function useEverything() {
  // fetch gardens, dogs, users, check-ins, etc.
}
```

### Styling
```typescript
// ✅ Use Tailwind + cn() for conditionals
import { cn } from "@/lib/utils";

<button className={cn("px-4 py-2", isActive && "bg-blue-500")}>
  Click me
</button>

// ❌ Avoid: Inline style objects
<button style={{ padding: isActive ? "8px 16px" : "4px 8px" }}>
```

### Error Handling
```typescript
// ✅ Good: Explicit error handling
try {
  const { data, error } = await supabase.from('gardens').select();
  if (error) throw error;
  return data;
} catch (err) {
  console.error('Failed to fetch gardens:', err);
  toast.error('Failed to load gardens');
}

// ❌ Avoid: Silent failures
const { data } = await supabase.from('gardens').select();
return data; // might be undefined if error occurred
```

---

## 📞 Getting Help

### When stuck:
1. **Check the docs** (you're reading it!)
2. **Look at similar code** (grep for patterns)
3. **Console logs** (`console.log()` & browser DevTools)
4. **Supabase logs** (dashboard → Logs section)
5. **Ask the team** (GitHub issues or Slack)

### Useful grep commands:
```bash
# Find all pages
grep -r "export default function" src/pages/

# Find all hooks
grep -r "^export function use" src/hooks/

# Find all translations
grep "appName" src/i18n/translations.ts

# Find RLS policies
grep -r "CREATE POLICY" supabase/
```

---

## 🎉 Next Steps

1. **Explore the codebase**: `npm run dev` and poke around
2. **Run a test**: `npm test`
3. **Try a small change**: Update a translation, see it live-reload
4. **Read PROJECT_ANALYSIS.md**: Deep dive into architecture
5. **Build for Android**: `npm run play`

---

## 📖 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vitejs.dev
- **Capacitor**: https://capacitorjs.com

---

**Built with ❤️ by the DogYard team**

Questions? Check PROJECT_ANALYSIS.md or reach out to the team.

Happy coding! 🐾


