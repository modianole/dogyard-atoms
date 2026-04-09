# Security Runbook: Secret Rotation After Exposure

## Scope
Use this runbook after accidental exposure of environment values in Git history or docs.

This project uses browser-side `VITE_*` variables (public at build time), but exposed values should still be rotated.

Related security trackers:
- `SECURITY_CVE_REMEDIATION.md`
- `SECURITY_CVE_EXCEPTIONS.md`
- `SECURITY_PATCH_OWNERSHIP.md`

## 1) Rotate Google Maps Key
1. Open Google Cloud Console -> APIs & Services -> Credentials.
2. Locate the exposed key used as `VITE_GOOGLE_MAPS_API_KEY`.
3. Create a new key.
4. Restrict the key:
   - Application restrictions: HTTP referrers (your domains only).
   - API restrictions: only Maps JavaScript API + Places API (if used).
5. Disable or delete the old key.

## 2) Rotate Supabase Client Values
1. Open Supabase Project Settings -> API.
2. Verify the project URL (`VITE_SUPABASE_URL`).
3. Regenerate or replace client key values used by the app:
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_ANON_KEY` (if used in fallback flow)
4. Confirm server-only secrets (service role) are not used in client env files.

## 3) Update Local Environment Files
Update local files (do not commit secrets):
- `.env`
- `.env.local`

Use this template:

```dotenv
VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_NEW_VALUE"
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_GOOGLE_MAPS_API_KEY="AIzaNEW_VALUE"
VITE_SUPABASE_ANON_KEY="NEW_ANON_VALUE"
VITE_ADMIN_USER_ID=""
VITE_ADMIN_EMAIL=""
```

Notes:
- `.env.local` is loaded by `compose.yaml` via `env_file`.
- `.env` and `.env.local` are ignored by `.gitignore`.

## 4) Update CI/CD Secrets
If you deploy from CI, update the same values in your CI secret store before next build.

## 5) Verify No Exposed Literals Remain
From repo root:

```powershell
git --no-pager grep -n "AIza"
```

```powershell
git --no-pager grep -n "sb_publishable_"
```

Expected: only placeholders or intentional examples in documentation.

## 6) Verify App Works With New Values
```powershell
npm run build
```

```powershell
docker compose build app
```

```powershell
docker compose up -d app
```

Then verify app endpoint and basic map/auth flows.

## 7) Post-Incident Checklist
- [ ] Old Google key disabled/deleted
- [ ] Supabase client values replaced
- [ ] Local env files updated
- [ ] CI secrets updated
- [ ] Build/deploy validation passed
- [ ] Team note added to avoid committing `.env*`

