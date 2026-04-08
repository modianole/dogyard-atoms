# 📋 DogYard Atoms - Codebase Review & Cloud Readiness Assessment

**Date:** April 9, 2026  
**Scope:** Full stack audit (Frontend, Mobile, Backend, DevOps, Security)  
**Status:** MVP readiness assessment for secure cloud deployment

---

## 🎯 Executive Summary

**DogYard** is a social app for dog owners in Israel to discover dog parks, report hazards, and order food. The stack is mature and feature-rich, but **cloud deployment requires critical fixes before production launch**.

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Radix UI + Tailwind CSS
- **Mobile:** Capacitor 6 (Android target)
- **Backend:** Supabase (Auth, RLS, SQL migrations)
- **External:** Google Maps API, Firebase (Crashlytics/Analytics), Lovable OAuth
- **Infra:** Docker + Nginx + Docker Compose + Kubernetes bridge (Kustomize)

### Key Metrics
- **Package:** 99 dependencies (locked via `package-lock.json`)
- **Code:** ~2,000 LOC across components, pages, hooks
- **Database:** 14+ migration files (roles, RLS, temporal triggers)
- **Tests:** 2 basic tests (legal pages); minimal coverage
- **Deployability:** **4/10** — blockers present, Kubernetes manifests invalid

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Cloud Deploy)

### 1. **Invalid Kubernetes Deployment Manifest**
📁 **File:** `bridge/base/app-deployment.yaml:26`

```yaml
restartPolicy: unless-stopped  # ❌ INVALID IN K8s
```

**Problem:**  
Kubernetes Deployment only accepts `Always`, `OnFailure`, or `Never`. This value will cause `kubectl apply` to **fail immediately**.

**Fix:**
```yaml
restartPolicy: Always  # ✅ Safe restart on any pod termination
```

---

### 2. **Missing Readiness & Liveness Probes**
📁 **File:** `bridge/base/app-deployment.yaml`

**Problem:**  
No `readinessProbe` or `livenessProbe` → Kubernetes treats pod as "ready" immediately (before Nginx boots) → traffic sent to broken container → 502 errors.

**Fix:** Add to `spec.template.spec.containers[0]`:
```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 15
  periodSeconds: 20
```

---

### 3. **Missing Resource Requests & Limits**
📁 **File:** `bridge/base/app-deployment.yaml`

**Problem:**  
No CPU/memory bounds → Kubernetes scheduler can't properly bin-pack → potential cluster overload → eviction.

**Fix:** Add to `spec.template.spec.containers[0]`:
```yaml
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

---

### 4. **Missing Security Context**
📁 **File:** `bridge/base/app-deployment.yaml`

**Problem:**  
Pod runs as root → privilege escalation risk → PCI/SOC2 compliance issues.

**Fix:** Add to `spec.template.spec`:
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 101  # nginx user
  fsReadOnlyRootFilesystem: true
```

---

### 5. **NetworkPolicy Blocks External Traffic**
📁 **File:** `bridge/base/default-network-policy.yaml:15-24`

```yaml
ingress:
  - from:
      - podSelector:
          matchLabels:
            com.docker.compose.network.default: "true"
```

**Problem:**  
Only allows pods with the label. Ingress controller cannot reach app → HTTP 502.

**Fix:** Add exceptions for Ingress:
```yaml
ingress:
  - from:
      - podSelector:
          matchLabels:
            com.docker.compose.network.default: "true"
  - from:
      - namespaceSelector:
          matchLabels:
            name: ingress-nginx  # Or your Ingress controller namespace
```

---

### 6. **Empty Required Build Arguments**
📁 **File:** `compose.yaml:16-22` → **Output from `docker compose config`:**

```yaml
args:
  PUBLIC_ADMIN_EMAIL: ""           # ❌ Empty
  PUBLIC_ADMIN_USER_ID: ""         # ❌ Empty
  PUBLIC_SUPABASE_ANON_KEY: ""     # ❌ Empty
  PUBLIC_GOOGLE_MAPS_API_KEY: "AIzaSyCqDd43LprUsfSlILHOmMwz1jcR9kYJWZM"
  PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_iUI-a0EBH_5f23CtcKVtXg_Sdk69TyD"
  PUBLIC_SUPABASE_URL: "https://keccmcwkqguooifloxnt.supabase.co"
```

**Problem:**  
Missing admin credentials and anon key → Admin pages will fail access checks, Supabase queries may fail.

**Fix:** Create `.env.prod` or documented CI/CD variable injections for all required vars.

---

## 🟠 IMPORTANT GAPS (Before Production)

### 7. **Missing Environment Contract Documentation**
📁 **Files:** No `.env.example` in repo

**Problem:**  
No explicit list of required/optional env vars → onboarding friction, incomplete deployments.

**Action:**
- Create `.env.example` with all `VITE_*` and `VITE_ADMIN_*` vars documented
- Create `DEPLOYMENT.md` explaining which vars are secrets vs. public

---

### 8. **Missing TLS/HTTPS & Ingress**
📁 **File:** `bridge/overlays/desktop/app-service.yaml`

```yaml
type: LoadBalancer  # ❌ No Ingress, no TLS termination
```

**Problem:**  
No HTTPS by default, no domain routing, no cert management.

**Action:**
- Add Ingress manifest with cert-manager (LetsEncrypt)
- Or configure LoadBalancer with cloud provider's SSL/TLS

---

### 9. **Nginx Missing Security Headers**
📁 **File:** `nginx.conf:24-26`

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Missing:**
- `Content-Security-Policy`
- `Strict-Transport-Security` (HSTS)
- `X-Permitted-Cross-Domain-Policies`

**Action:** Add to `nginx.conf`:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
add_header X-Permitted-Cross-Domain-Policies "none" always;
```

---

### 10. **Port Mismatch in Documentation**
📁 **File:** `scripts/docker-reset-and-run.ps1:78` vs. `compose.yaml:24`

```powershell
# script says:
Write-Host "URL: http://localhost:8090"

# compose says:
ports:
  - "8080:80"
```

**Problem:**  
Confuses operators about correct port.

**Action:** Align to `8080` everywhere (update script comment).

---

### 11. **No CI/CD Pipeline**
📁 **Missing:** `.github/workflows/*`

**Problem:**  
No automated build → push → deploy workflow. Manual deployments are error-prone.

**Action:**
- Create `.github/workflows/deploy.yml` for image build, scan, push to registry, Kustomize deploy.

---

### 12. **Missing Admin RLS Enforcement**
📁 **Files:** `src/hooks/useDeveloperAccess.ts` (client-side only)

**Problem:**  
Admin check is client-side (`VITE_ADMIN_*`). User can spoof headers → data breach risk.

**Action:**
- Verify Supabase RLS on `gardens`/`protected_spaces` requires `public.has_role(auth.uid(), 'admin')`
- Confirm upsert logic in `src/pages/AdminImport.tsx` enforces server-side (Supabase) validation

---

---

## 🟡 RECOMMENDATIONS (Nice-to-Have Before Launch)

| # | Area | Gap | Priority | Effort |
|---|------|-----|----------|--------|
| 13 | Monitoring | No structured logs/metrics (Prometheus/Datadog) | Medium | 2h |
| 14 | Testing | Only 2 basic tests; admin flows untested | Medium | 4h |
| 15 | Image Scanning | No SBOM/CVE scanning in build | Low | 1h |
| 16 | Disaster Recovery | No backup policy for Supabase RLS/data | Medium | 2h |
| 17 | Rate Limiting | No API rate limits on Google Places fetch | Low | 1h |
| 18 | Error Pages | 404/500 pages basic; no localization | Low | 0.5h |

---

## ✅ CHECKLIST: MVP Cloud-Ready Launch

### Phase 1: Fix Critical Blockers (Est. 1–2 hours)
- [ ] Update `bridge/base/app-deployment.yaml`:
  - [ ] Change `restartPolicy` to `Always`
  - [ ] Add `readinessProbe` (5s initial, 10s period)
  - [ ] Add `livenessProbe` (15s initial, 20s period)
  - [ ] Add `resources.requests` (100m CPU, 256Mi memory)
  - [ ] Add `resources.limits` (500m CPU, 512Mi memory)
  - [ ] Add `securityContext` (runAsNonRoot, runAsUser: 101)
- [ ] Update `bridge/base/default-network-policy.yaml`:
  - [ ] Add Ingress controller namespace exception
- [ ] Create `.env.example` with all required vars
- [ ] Document env vars in `DEPLOYMENT.md`
- [ ] Verify Supabase RLS policies enforce admin role on write operations

### Phase 2: Harden Security (Est. 1–2 hours)
- [ ] Add missing Nginx headers (CSP, HSTS, etc.)
- [ ] Add Ingress + cert-manager for HTTPS
- [ ] Update `compose.yaml` with all required `PUBLIC_*` vars defined
- [ ] Align port references (8080) across docs/scripts

### Phase 3: Build & Deploy Pipeline (Est. 2–3 hours)
- [ ] Create `.github/workflows/deploy.yml`:
  - [ ] Checkout code
  - [ ] Build Docker image
  - [ ] Scan image for CVEs (Trivy)
  - [ ] Push to container registry (Docker Hub / ECR / GCR)
  - [ ] Deploy via Kustomize overlay
- [ ] Document cloud provider setup (choose: AWS EKS, GCP GKE, Azure AKS)

### Phase 4: Testing & Validation (Est. 1–2 hours)
- [ ] Dry-run deployment to staging cluster
- [ ] Verify health checks respond correctly
- [ ] Test admin flows (Google Places import, garden approval)
- [ ] Load test (locust/k6) baseline
- [ ] Security test (OWASP ZAP baseline scan)

### Phase 5: Go-Live (Est. 0.5 hours)
- [ ] Point DNS to LoadBalancer/Ingress
- [ ] Monitor logs & alerts for 24h
- [ ] Document runbooks for common issues

---

## 📊 Current State Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| **Codebase Quality** | ✅ Good | Well-structured, TypeScript, tests exist |
| **Kubernetes Readiness** | ❌ Not Ready | Invalid manifest, missing probes/resources |
| **Security Posture** | 🟠 Partial | Client-side admin checks risky, RLS should enforce |
| **Docker Image** | ✅ Good | `.dockerignore` solid, base image clean |
| **Environment Management** | 🟠 Partial | No `.env.example`, vars undocumented |
| **CI/CD** | ❌ Missing | No pipelines present |
| **Monitoring** | ❌ Missing | No logging/metrics infrastructure |
| **TLS/HTTPS** | ❌ Missing | No Ingress or explicit TLS setup |

---

## 📖 Reference Files

### Deploy & Infrastructure
- `Dockerfile` — Multi-stage, Nginx final, clean build
- `compose.yaml` — Basic, missing prod secrets
- `nginx.conf` — SPA routing OK, headers need hardening
- `bridge/base/app-deployment.yaml` — **INVALID, needs fixes**
- `bridge/base/app-service.yaml` — OK (basic Service)
- `bridge/overlays/desktop/app-service.yaml` — LoadBalancer, no TLS

### Source Code
- `src/main.tsx`, `src/App.tsx` — Entry, router, deep-link handling
- `src/pages/AdminImport.tsx` — Google Places bulk importer (516 LOC)
- `src/pages/AdminGardens.tsx` — Garden approval UI
- `src/hooks/useDeveloperAccess.ts` — **Client-side admin check** (risky)
- `src/integrations/supabase/client.ts` — Supabase config (VITE env vars)

### Database
- `supabase/migrations/20260315175015_255e41cc-6a55-43d9-9898-9e642025deed.sql` — Core schema (users, gardens, orders, etc.)
- `supabase/migrations/20260316100000_check_in_logic.sql` — Check-in table & view
- `supabase/migrations/20260408100000_create_protected_spaces.sql` — Protected spaces (מרחבים מוגנים)

### Package & Tooling
- `package.json` — React 18, Capacitor 6, Supabase 2.99, TanStack Query 5
- `vite.config.ts` — Dev endpoints banner, path alias
- `vitest.config.ts` — jsdom, 2 basic tests
- `eslint.config.js` — React Hooks, React Refresh rules (lints disabled on unused vars)

---

## 🚀 Next Steps (Immediate Actions)

1. **Today:** Fix all P0 blockers (Kubernetes manifest, RLS, env vars)
2. **Tomorrow:** Add CI/CD pipeline and test staging deployment
3. **This week:** Security hardening, monitoring setup, load testing
4. **Launch week:** DNS cutover, 24h monitoring, runbook on-call

---

**Owner:** DevOps Lead / Deployment Engineer  
**Review Date:** April 9, 2026  
**Last Updated:** April 9, 2026

---

*Generated during MVP readiness audit. All blockers must be resolved before production deployment.*

