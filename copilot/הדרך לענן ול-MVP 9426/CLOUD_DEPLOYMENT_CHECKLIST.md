# 🎯 Cloud Deployment Task Checklist

**Project:** DogYard Atoms (MVP)  
**Created:** April 9, 2026  
**Owner:** [DevOps/Engineering Lead]  
**Target:** Secure, production-ready Kubernetes deployment

---

## Phase 1️⃣: Fix Critical Kubernetes Blockers

### Manifest Validation
- [ ] **Review:** `bridge/base/app-deployment.yaml` (current state invalid)
- [ ] **Fix:** Change `restartPolicy: unless-stopped` → `Always`
  - **File:** `bridge/base/app-deployment.yaml:26`
  - **Reason:** Kubernetes only accepts `Always`, `OnFailure`, `Never`
  - **Test:** `kubectl apply --dry-run=client` should pass

### Add Health Checks
- [ ] **Add readinessProbe** to `spec.template.spec.containers[0]`
  ```yaml
  readinessProbe:
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 5
    periodSeconds: 10
    timeoutSeconds: 3
    failureThreshold: 3
  ```
- [ ] **Add livenessProbe** to `spec.template.spec.containers[0]`
  ```yaml
  livenessProbe:
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 15
    periodSeconds: 20
    timeoutSeconds: 3
    failureThreshold: 3
  ```
- [ ] **Test:** Pod becomes `Ready` after ~5 seconds, stays healthy

### Resource Limits
- [ ] **Add resources** to `spec.template.spec.containers[0]`
  ```yaml
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 500m
      memory: 512Mi
  ```
- [ ] **Rationale:** Prevents scheduler issues, cluster overload, eviction

### Security Context
- [ ] **Add securityContext** to `spec.template.spec`
  ```yaml
  securityContext:
    runAsNonRoot: true
    runAsUser: 101
    fsReadOnlyRootFilesystem: true
  ```
- [ ] **Test:** Pod runs as non-root, no privilege escalation

### Network Policy Fix
- [ ] **Review:** `bridge/base/default-network-policy.yaml`
- [ ] **Add Ingress exception:**
  ```yaml
  ingress:
    - from:
        - podSelector:
            matchLabels:
              com.docker.compose.network.default: "true"
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
  ```
- [ ] **Test:** Ingress controller can reach app Pod

---

## Phase 2️⃣: Environment & Secrets Management

### Create .env Contract
- [ ] **Create:** `copilot/ENV_VARS.md` (or `.env.example`)
  - Document all `VITE_*` variables (public)
  - Document `VITE_ADMIN_*` variables (must be set for admin features)
  - Document `VITE_SUPABASE_*` variables (required, public)
  - Document `VITE_GOOGLE_MAPS_API_KEY` (required, public but rate-limited)

### Update docker compose
- [ ] **Populate compose.yaml** with all required `PUBLIC_*` build args
  ```yaml
  args:
    PUBLIC_SUPABASE_URL: ${VITE_SUPABASE_URL}
    PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${VITE_SUPABASE_PUBLISHABLE_KEY}
    PUBLIC_ADMIN_USER_ID: ${VITE_ADMIN_USER_ID}
    PUBLIC_ADMIN_EMAIL: ${VITE_ADMIN_EMAIL}
    PUBLIC_GOOGLE_MAPS_API_KEY: ${VITE_GOOGLE_MAPS_API_KEY}
  ```
- [ ] **Create** `.env.prod` template for cloud deployment with placeholders

### Validate Secret Handling
- [ ] **Audit:** Verify no secrets in:
  - Git history (run `git log --all --full-history --diff-filter=D -- <file>` for deleted secrets)
  - Docker image (run `docker inspect dogyard-atoms:local --format='{{json .Config.Env}}'`)
  - Compose file in plain text
- [ ] **Confirm:** `.dockerignore` excludes `.env.*` and `*.keystore`
- [ ] **Plan:** Use cloud secret manager (AWS Secrets Manager / GCP Secret Manager / Vault)

---

## Phase 3️⃣: Security Hardening

### Nginx Headers
- [ ] **Update:** `nginx.conf` with security headers
  ```nginx
  # Add after line 26 (current headers section):
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';" always;
  add_header X-Permitted-Cross-Domain-Policies "none" always;
  add_header Permissions-Policy "geolocation=(self), microphone=(), camera=()" always;
  ```
- [ ] **Test:** Check headers in browser DevTools or `curl -I http://localhost:8080`

### HTTPS & TLS
- [ ] **Choose TLS strategy:**
  - [ ] Option A: Ingress + cert-manager (LetsEncrypt) — recommended
  - [ ] Option B: Cloud provider managed (AWS ALB/NLB, GCP Cloud Armor, Azure App Gateway)
- [ ] **If Ingress:** Create `bridge/base/app-ingress.yaml`
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: app-ingress
    namespace: dogyard-atoms
    annotations:
      cert-manager.io/cluster-issuer: "letsencrypt-prod"
  spec:
    ingressClassName: nginx
    tls:
      - hosts:
          - dogyard.example.com
        secretName: app-tls-cert
    rules:
      - host: dogyard.example.com
        http:
          paths:
            - path: /
              pathType: Prefix
              backend:
                service:
                  name: app-published
                  port:
                    number: 80
  ```
- [ ] **Add cert-issuer:** `bridge/base/cert-issuer.yaml`
- [ ] **Test:** Certificate issued, HTTPS works, A+ on SSL Labs

### Admin Access Control
- [ ] **Verify:** Supabase RLS policies on `gardens` table
  - [ ] SELECT: public
  - [ ] INSERT: authenticated users
  - [ ] UPDATE: `public.has_role(auth.uid(), 'admin')` — **must enforce server-side**
  - [ ] DELETE: `public.has_role(auth.uid(), 'admin')` — **must enforce server-side**
- [ ] **Verify:** `protected_spaces` RLS same as above
- [ ] **Test:** Non-admin user cannot UPDATE/DELETE via raw Supabase client call

### API Key Security
- [ ] **Rotate:** `VITE_GOOGLE_MAPS_API_KEY` (currently visible in public context)
  - Use API key restrictions (IP whitelist, HTTP referrer limit to `*.dogyard.com`)
- [ ] **Check:** `VITE_SUPABASE_ANON_KEY` is truly "public" key (NOT service role)
- [ ] **Audit:** No private/service keys in `.env` or build config

---

## Phase 4️⃣: Build & Deployment Pipeline

### GitHub Actions Workflow
- [ ] **Create:** `.github/workflows/deploy.yml`
  ```yaml
  name: Build & Deploy to Cloud
  on:
    push:
      branches:
        - main
        - staging
  env:
    REGISTRY: ghcr.io
    IMAGE_NAME: ${{ github.repository }}
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: docker/setup-buildx-action@v3
        - name: Build & Push
          uses: docker/build-push-action@v5
          with:
            context: .
            push: true
            tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            build-args: |
              PUBLIC_SUPABASE_URL=${{ secrets.SUPABASE_URL }}
              PUBLIC_SUPABASE_PUBLISHABLE_KEY=${{ secrets.SUPABASE_PUBLISHABLE_KEY }}
              PUBLIC_ADMIN_USER_ID=${{ secrets.ADMIN_USER_ID }}
              PUBLIC_ADMIN_EMAIL=${{ secrets.ADMIN_EMAIL }}
              PUBLIC_GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}
        - name: Scan image
          uses: aquasecurity/trivy-action@master
          with:
            image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            format: sarif
            output: trivy-results.sarif
        - name: Deploy to staging
          if: github.ref == 'refs/heads/staging'
          uses: actions/checkout@v4
        # Add kustomize build → kubectl apply step
  ```
- [ ] **Add secrets:** In GitHub Settings → Secrets:
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
  - `ADMIN_USER_ID`
  - `ADMIN_EMAIL`
  - `GOOGLE_MAPS_API_KEY`
  - Registry credentials if needed

### Container Registry
- [ ] **Choose registry:**
  - [ ] GitHub Container Registry (GHCR) — free, integrated with GitHub
  - [ ] AWS ECR
  - [ ] GCP Artifact Registry
  - [ ] Docker Hub
- [ ] **Create:** Lifecycle policies to purge old images
- [ ] **Enable:** Image scanning (Trivy / AWS Inspector / GCP VulnerabilityScanning)

### Deploy Target
- [ ] **Choose cloud platform:**
  - [ ] **AWS EKS** — mature, complex
  - [ ] **GCP GKE** — integrated with Cloud Run / Autopilot
  - [ ] **Azure AKS** — good for Microsoft shops
  - [ ] **DigitalOcean Kubernetes** — simpler, cheaper
- [ ] **Provision cluster:** (assume managed K8s, e.g., EKS, GKE)
- [ ] **Install Ingress Controller:**
  ```bash
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace
  ```
- [ ] **Install cert-manager:** (if using Ingress + HTTPS)
  ```bash
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
  ```

### Kustomize Overlays
- [ ] **Review:** `bridge/base` & `bridge/overlays/desktop`
- [ ] **Create overlays for each env:**
  - [ ] `bridge/overlays/staging/kustomization.yaml`
  - [ ] `bridge/overlays/production/kustomization.yaml`
- [ ] **Example:** `bridge/overlays/production/app-deployment-patch.yaml`
  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: app
  spec:
    replicas: 3  # Scale up for prod
    template:
      spec:
        affinity:
          podAntiAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              - labelSelector:
                  matchExpressions:
                    - key: app
                      operator: In
                      values:
                        - dogyard
                topologyKey: kubernetes.io/hostname
  ```

---

## Phase 5️⃣: Testing & Validation

### Local Smoke Test
- [ ] **Build & run locally:**
  ```bash
  docker compose build
  docker compose up -d
  curl -I http://localhost:8080
  # Should return 200 OK with all headers present
  ```
- [ ] **Check health endpoint:**
  ```bash
  curl http://localhost:8080/
  # Should serve HTML (SPA)
  ```

### Staging Deployment
- [ ] **Deploy to staging cluster:**
  ```bash
  kubectl apply -k bridge/overlays/staging
  kubectl wait --for=condition=available --timeout=300s \
    deployment/app -n dogyard-atoms
  ```
- [ ] **Verify Pod readiness:**
  ```bash
  kubectl get pods -n dogyard-atoms
  # Should show STATUS=Running, READY=1/1
  ```
- [ ] **Test via LoadBalancer:**
  ```bash
  kubectl get svc -n dogyard-atoms app-published
  # Get external IP, curl it
  ```

### Functional Testing
- [ ] **Test main flows:**
  - [ ] Home page loads (`/`)
  - [ ] Map loads & fetches gardens (`/map`)
  - [ ] Auth flow works (OAuth redirect)
  - [ ] Admin import page accessible (if logged in as admin)
  - [ ] Garden details page (`/garden/{id}`)
- [ ] **Test API integrations:**
  - [ ] Supabase queries work (check Network tab in DevTools)
  - [ ] Google Maps API responds (check for API errors in console)
  - [ ] No CORS errors

### Security Testing
- [ ] **OWASP ZAP baseline scan:**
  ```bash
  docker run --network host -t owasp/zap2docker-stable \
    zap-baseline.py -t http://localhost:8080
  ```
- [ ] **Check security headers:**
  ```bash
  curl -I https://staging.dogyard.example.com | grep -E "^(Strict|Content-Security|X-)"
  ```
- [ ] **Test RLS enforcement:**
  - Create non-admin user
  - Try to call Supabase UPDATE on `gardens` via console
  - Should fail with RLS policy violation

### Load Testing
- [ ] **Install k6 or locust:**
  ```bash
  # k6 example
  k6 run --vus 10 --duration 30s <<'EOF'
  import http from 'k6/http';
  export default function() {
    http.get('http://staging.dogyard.example.com/');
  }
  EOF
  ```
- [ ] **Baseline:** Record response times, error rate
- [ ] **Monitor:** CPU/memory during load (should stay within limits)

### Data Integrity
- [ ] **Verify Supabase backups** are configured
- [ ] **Test restore process** on staging (snapshot → restore → verify)
- [ ] **Document RTO/RPO:** e.g., "15-min RPO, 1-hour RTO"

---

## Phase 6️⃣: Production Readiness

### Monitoring & Observability
- [ ] **Set up logging:**
  - [ ] Fluentd / Datadog / ELK to capture Nginx/app logs
  - [ ] Structured logs (JSON) for easy parsing
- [ ] **Set up metrics:**
  - [ ] Prometheus scraping Nginx (via exporter)
  - [ ] Dashboard for request rate, latency, error rate
  - [ ] CPU/memory utilization by pod
- [ ] **Set up alerts:**
  - [ ] Pod CrashLoopBackOff → page on-call
  - [ ] High error rate (>5%) → alert
  - [ ] Pod not ready after 2 min → alert
  - [ ] Disk usage >80% → alert

### Backup & Disaster Recovery
- [ ] **Supabase backups:**
  - [ ] Enable automated daily backups (Supabase project settings)
  - [ ] Test restore on non-prod environment
- [ ] **Persistent data:**
  - [ ] If using local storage, plan for PVC / managed DB
- [ ] **Runbook:** Create `RUNBOOK.md` with:
  - Pod crashed → restart: `kubectl delete pod <name> -n dogyard-atoms`
  - Database connection issues → check RLS policies
  - High latency → check pod resources, scale replicas

### Documentation
- [ ] **Deploy guide:** How to deploy (commit → image → cluster)
- [ ] **Env vars guide:** All required `PUBLIC_*` and how to inject
- [ ] **Troubleshooting guide:** Common issues & fixes
- [ ] **On-call runbook:** Escalation, who to page

### DNS & Domain
- [ ] **Register domain:** `dogyard.example.com` (choose actual name)
- [ ] **DNS records:**
  - [ ] A/AAAA → Ingress LoadBalancer IP (or CNAME to cloud load balancer)
  - [ ] Verify with `nslookup dogyard.example.com`
- [ ] **HTTPS:** Cert issued & valid (from cert-manager or cloud provider)

---

## Phase 7️⃣: Launch & Go-Live

### Pre-Launch Checklist (48 hours before)
- [ ] **All P0 blockers resolved** ✅
- [ ] **Staging deployment passes all tests** ✅
- [ ] **Monitoring & alerts active** ✅
- [ ] **Runbook reviewed by on-call team** ✅
- [ ] **Backup/restore tested** ✅
- [ ] **Admin user provisioned in Supabase** ✅

### Launch Day
- [ ] **DNS cutover:** Point production domain to Ingress/LoadBalancer
- [ ] **Verify:** `curl https://dogyard.example.com` returns 200
- [ ] **Smoke test:** All main flows work
- [ ] **Monitor:** Watch logs & metrics for 1 hour
- [ ] **Notify:** Announce to users (via email, in-app, etc.)

### Post-Launch (24h)
- [ ] **Check logs:** No error spikes
- [ ] **Monitor metrics:** Response times stable, no OOM events
- [ ] **User feedback:** Any reported issues?
- [ ] **Database:** Verify queries responsive, no slow logs

---

## 📊 Status Tracking

| Phase | Task | Status | Owner | ETA |
|-------|------|--------|-------|-----|
| 1️⃣ | Fix K8s manifest | ⏳ TODO | DevOps | Apr 10 |
| 1️⃣ | Add health probes | ⏳ TODO | DevOps | Apr 10 |
| 1️⃣ | Add resource limits | ⏳ TODO | DevOps | Apr 10 |
| 1️⃣ | Fix NetworkPolicy | ⏳ TODO | DevOps | Apr 10 |
| 2️⃣ | Create ENV contract | ⏳ TODO | Lead | Apr 10 |
| 2️⃣ | Update compose.yaml | ⏳ TODO | DevOps | Apr 10 |
| 3️⃣ | Hardening (Nginx + TLS) | ⏳ TODO | DevOps | Apr 11 |
| 3️⃣ | Verify RLS policies | ⏳ TODO | Backend | Apr 11 |
| 4️⃣ | GitHub Actions workflow | ⏳ TODO | DevOps | Apr 11 |
| 4️⃣ | Setup K8s cluster | ⏳ TODO | DevOps | Apr 11 |
| 4️⃣ | Kustomize overlays | ⏳ TODO | DevOps | Apr 12 |
| 5️⃣ | Staging deployment | ⏳ TODO | DevOps | Apr 12 |
| 5️⃣ | Functional testing | ⏳ TODO | QA | Apr 12 |
| 5️⃣ | Load testing | ⏳ TODO | QA | Apr 13 |
| 6️⃣ | Monitoring setup | ⏳ TODO | DevOps | Apr 13 |
| 6️⃣ | Runbook authoring | ⏳ TODO | Lead | Apr 13 |
| 7️⃣ | DNS & domain | ⏳ TODO | DevOps | Apr 14 |
| 7️⃣ | **GO LIVE** | ⏳ TODO | Lead | **Apr 14** |

---

## 🚨 Escalation

If blockers arise:
- **DevOps lead:** K8s, Docker, Ingress issues
- **Backend lead:** Supabase, RLS, database issues
- **QA lead:** Testing, security scanning
- **Product lead:** Priority, launch timing

---

**Last Updated:** April 9, 2026  
**Next Review:** April 10, 2026 (after Phase 1)


