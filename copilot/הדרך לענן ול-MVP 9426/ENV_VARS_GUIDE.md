# Environment Variables Configuration for DogYard Atoms MVP

## Public Variables (safe in browser & Docker image)

### Supabase Backend
- `VITE_SUPABASE_URL` — Supabase project URL (e.g., `https://yourproject.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public anon key for browser/mobile clients

### Google Maps
- `VITE_GOOGLE_MAPS_API_KEY` — API key for Maps/Places library
  - **⚠️ Must have API key restrictions:** IP whitelist, HTTP referrer limit

### Admin Configuration (Optional but required for admin features)
- `VITE_ADMIN_USER_ID` — UUID of admin user (Supabase `auth.users.id`)
- `VITE_ADMIN_EMAIL` — Email of admin user for fallback check
- `VITE_DEVELOPER_EMAILS` — Comma-separated list of developer emails (legacy support)

---

## Secret Variables (Never in code, use cloud secret manager)

These are **NOT** included in Docker build or client bundle. Inject via environment at runtime:

- `SUPABASE_SERVICE_ROLE_KEY` — Server-side admin key (if using server-side RPC)
- `FIREBASE_ADMIN_SDK_KEY` — Admin SDK for Crashlytics setup (if needed on backend)
- Database backup credentials (if automated backups to cloud storage)

---

## Example .env.prod (for cloud deployment)

```env
# ===== REQUIRED =====
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxxx

# ===== ADMIN SETUP =====
VITE_ADMIN_USER_ID=550e8400-e29b-41d4-a716-446655440000
VITE_ADMIN_EMAIL=admin@dogyard.example.com

# ===== OPTIONAL =====
# VITE_DEVELOPER_EMAILS=dev1@example.com,dev2@example.com
```

---

## Deployment Methods

### Local Development
```bash
# Create .env.local with values above
npm run dev
```

### Docker Compose (Staging)
```bash
# Load from .env.prod file
docker compose --env-file .env.prod up
```

### Kubernetes (Production)
Use cloud secret manager to inject at pod runtime:

**AWS Secrets Manager Example:**
```bash
# Store secrets
aws secretsmanager create-secret \
  --name dogyard/prod \
  --secret-string '{
    "SUPABASE_URL": "https://...",
    "SUPABASE_KEY": "..."
  }'

# In CI/CD, inject into Kustomize values
```

**GCP Secret Manager Example:**
```bash
gcloud secrets create dogyard-supabase-url \
  --replication-policy="automatic" \
  --data-file=- <<< "https://..."

# Reference in Deployment via external-secrets operator
```

---

## Security Checklist

- [ ] No secrets in Git (use `.gitignore`, check history with `git-secrets`)
- [ ] API keys have restrictive quotas/IPs/origins
- [ ] Supabase anon key is truly "public" (not service role key)
- [ ] Service role keys stored in cloud secret manager only
- [ ] Environment variables logged/printed only in dev mode (not prod logs)
- [ ] Docker image does NOT embed secrets (all injected at runtime)
