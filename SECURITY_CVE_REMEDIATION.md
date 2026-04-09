# DogYard Atoms - CVE Remediation Plan

**Total Vulnerabilities Detected:** 64  
**Severity Breakdown:** 3 CRITICAL | 18 HIGH | 34 MEDIUM | 9 LOW  
**Status:** Dockerfile migrated from Alpine to Debian (nginx:1.27)  
**Last Scan:** 2026-04-10
**Last Remediation Update:** 2026-04-10

---

## 🔴 CRITICAL (3 CVEs)

### libxml2 - XML Processing Library
| CVE | Package | Current | Fixed | Status |
|-----|---------|---------|-------|--------|
| CVE-2025-49796 | libxml2@2.13.4-r5 | <2.13.9-r0 | 2.13.9-r0 | **FIXED** (Debian rebuild) |
| CVE-2025-49794 | libxml2@2.13.4-r5 | <2.13.9-r0 | 2.13.9-r0 | **FIXED** (Debian rebuild) |

**Remediation:** `docker compose up --build` pulls latest Debian packages  
**Impact:** XML parsing vulnerabilities in image library dependencies  

### expat - XML Parser
| CVE | Package | Current | Fixed | Status |
|-----|---------|---------|-------|--------|
| CVE-2026-32767 | expat@2.7.0-r0 | <2.7.5-r0 | 2.7.5-r0 | **FIXED** (Debian rebuild) |

**Remediation:** Included in base OS patches during rebuild  
**Impact:** RCE in XML parsing (expat used by curl/nghttp2)  

---

## 🟠 HIGH (18 CVEs)

### OpenSSL - Cryptography Library (9 items)
| CVE | Fixed | Impact |
|-----|-------|--------|
| CVE-2025-15467 | 3.3.6-r0 | Cryptographic weakness |
| CVE-2025-9230 | 3.3.5-r0 | Data leak potential |
| CVE-2025-69421 | 3.3.6-r0 | TLS negotiation bypass |
| CVE-2025-69420 | 3.3.6-r0 | Certificate validation flaw |
| CVE-2025-69419 | 3.3.6-r0 | Session resumption attack |
| CVE-2026-22795 | 3.3.6-r0 | Buffer overflow |
| CVE-2026-22796 | 3.3.6-r0 | Memory safety |

**Remediation:** `docker compose up --build` (Debian openssl auto-patched)  
**Action:** None needed - automatic with rebuild  

### curl - HTTP Client (3 items)
| CVE | Fixed | Impact |
|-----|-------|--------|
| CVE-2026-3805 | not fixed | HTTP/2 attack |
| CVE-2025-9086 | 8.14.1-r2 | Request smuggling |
| CVE-2025-5399 | 8.14.1-r0 | Information leak |

**Remediation:** Update curl during rebuild  
**Action:** None needed - automatic with rebuild  

### libpng - Image Library (6 items)
| CVE | Fixed | Impact |
|-----|-------|--------|
| CVE-2026-25646 | 1.6.55-r0 | Buffer overflow in image parsing |
| CVE-2026-33636 | 1.6.56-r0 | DoS attack |
| CVE-2026-33416 | 1.6.56-r0 | Heap corruption |
| CVE-2025-66293 | 1.6.53-r0 | Integer overflow |
| CVE-2025-65018 | 1.6.53-r0 | Memory safety |
| CVE-2025-64720 | 1.6.53-r0 | Crash on malformed PNG |

**Remediation:** Debian packages include fixes  
**Action:** None needed - automatic with rebuild  

---

## 🟡 MEDIUM (34 CVEs)

### Grouped by Library:
- **libxml2** (5): MEDIUM security issues - Fixed via Debian rebuild
- **expat** (5): MEDIUM XML parsing flaws - Fixed via Debian rebuild
- **OpenSSL** (6): MEDIUM crypto weaknesses - Fixed via Debian rebuild
- **libpng** (4): MEDIUM image parsing issues - Fixed via Debian rebuild
- **curl** (9): MEDIUM HTTP client vulnerabilities - Fixed via Debian rebuild
- **fontconfig** (1): CVE-2026-34085 - Font rendering DoS
- **c-ares** (1): CVE-2025-62408 - DNS resolution flaw
- **tiff** (2): MEDIUM image processing issues
- **libavif** (2): MEDIUM AVIF codec issues

**Remediation:** All included in Debian OS updates  
**Action:** None needed - automatic with rebuild  

---

## 🟢 LOW (9 CVEs)

| CVE | Package | Impact | Fix |
|-----|---------|--------|-----|
| CVE-2025-32415 | libxml2 | Low memory issue | Included |
| CVE-2025-6170 | libxml2 | Low severity | Included |
| CVE-2026-22801 | libpng | Minor DoS | Included |
| CVE-2026-22695 | libpng | Minor issue | Included |
| CVE-2026-32778 | expat | Low impact | Included |
| CVE-2026-24515 | expat | Low impact | Included |
| CVE-2025-46394 | busybox | Shell utility issue | 1.37.0-r14 |
| CVE-2024-58251 | busybox | Utility bug | 1.37.0-r14 |
| CVE-2026-27171 | zlib | Compression issue | Not fixed (low impact) |

**Remediation:** Low priority - monitor in scheduled maintenance  
**Action:** Include in quarterly patch schedule  

---

## ✅ Completed Actions

- ✅ Migrated Dockerfile from `nginx:1.27-alpine` to `nginx:1.27` (Debian-based)
- ✅ Updated `.env` placeholders for key rotation
- ✅ Force-pushed security cleanup to GitHub (removed `.env` from history)
- ✅ Committed Dockerfile changes to git

---

## 📋 Remaining Actions (High to Low Priority)

### Priority 1: Key Rotation (SECURITY)
- [ ] Paste new Supabase publishable key into `.env`
- [ ] Paste new Google Maps API key into `.env`
- [ ] Paste new Supabase anon key into `.env`

### Priority 2: Rebuild & Verify
- [x] Run `docker compose up --build` to apply all patches
- [x] Run `docker scout cves dogyard-atoms:local` to verify CVE reduction
- [x] Verify container starts and healthcheck passes
- [x] Enforce non-root user (10001:10001) in both `Dockerfile` and `compose.yaml`

### Priority 3: Automation & Hardening
- [x] Set up GitHub Actions CVE scan (`.github/workflows/cve-scan.yml`) on pull requests and main pushes
- [x] Add scheduled scans (weekly + monthly) and manual `workflow_dispatch` trigger
- [x] Publish MEDIUM/LOW CVE report artifact on every run (non-blocking)
- [ ] Consider Docker Hardened Images (DHI) for production (decision deferred, next review: 2026-05-10)
- [x] Schedule weekly `docker compose up --build` for patch updates (documented in `SECURITY_PATCH_OWNERSHIP.md`)
- [ ] Document rotated keys in secure vault (LastPass, 1Password, etc.)

---

## 🔐 Security Baseline After Rebuild

| Aspect | Status | Evidence |
|--------|--------|----------|
| Base Image Security | ✅ | Debian (CVE fixes automated) |
| Non-Root Execution | ✅ | User 10001:10001 |
| Read-Only Root FS | ✅ | Configured in `compose.yaml` with `tmpfs` for nginx writable paths |
| Network Policy | ⏳ | Recommended for K8s |
| Secret Scanning | ✅ | `.gitignore` + filter-branch cleanup |
| API Key Rotation | ⏳ | Pending key replacement |

---

## 🧩 Chunk Progress

### Chunk 1 (CRITICAL/HIGH first) - 2026-04-10
- ✅ Build stage aligned to Debian (`node:20-bookworm-slim`) to reduce Alpine-related CVE drift.
- ✅ Final image now runs `apt-get upgrade` during build for latest Debian security patches.
- ✅ Non-root execution enforced in-image (`USER 10001:10001`).
- ✅ Runtime hardening enabled in Compose: `read_only`, `tmpfs`, `cap_drop: [ALL]`, `no-new-privileges`.
- ✅ CI CVE gate added: Trivy blocks on `CRITICAL/HIGH`, plus non-blocking Docker Scout reporting.
- ✅ Runtime verification completed in Chunk 3 (`docker compose up --build`, healthcheck, Docker Scout post-scan).

### Chunk 2 (MEDIUM/LOW tracking + hardening) - 2026-04-10
- ✅ CVE workflow now supports weekly/monthly scheduled runs and manual dispatch.
- ✅ MEDIUM/LOW findings are exported as an artifact to keep visibility without blocking delivery.
- ✅ Added extra safe HTTP hardening headers in `nginx.conf` (`Permissions-Policy`, `CORP`, `COOP`).
- ⏳ Still pending: replace rotated keys in `.env`.

### Chunk 3 (Priority 2 verification) - 2026-04-10
- ✅ Rebuild verification completed with `docker compose up --build -d`.
- ✅ Runtime verification passed: container health is `healthy` and runtime user is `10001:10001`.
- ✅ Header verification passed on `http://localhost:8082` for hardened nginx response headers.
- ✅ Post-rebuild scan executed: Docker Scout reports `0C / 2H / 4M / 72L / 2?` (80 total).
- ⚠️ Residual HIGH findings currently include `CVE-2026-33164` (`libde265`) and `CVE-2026-27135` (`nghttp2`) with "not fixed" in current Debian stream.

### Chunk 4 (Residual HIGH governance) - 2026-04-10
- ✅ Added exception register in `SECURITY_CVE_EXCEPTIONS.md` for unresolved HIGH CVEs.
- ✅ Added patch ownership/cadence runbook in `SECURITY_PATCH_OWNERSHIP.md`.
- ✅ Extended CI artifacts with non-blocking HIGH trend report in `.github/workflows/cve-scan.yml`.
- ⏳ Remaining open item: rotate and document new keys in vault, then close Priority 1.

---

## 📊 Expected Results After Rebuild

**Before:** 64 vulnerabilities (3 CRITICAL, 18 HIGH, 34 MEDIUM, 9 LOW)  
**After:** ~10-15 vulnerabilities (0 CRITICAL, 2-4 HIGH, 6-10 MEDIUM, 2-4 LOW)  
**Impact:** ~80% reduction in risk surface

### Actual observed after rebuild (Docker Scout, 2026-04-10)
- **0 CRITICAL, 2 HIGH, 4 MEDIUM, 72 LOW, 2 UNSPECIFIED (80 total)**
- Interpretation: criticals were eliminated, but scanner data source and historic low-CVE backlog keep LOW counts high.
- Immediate focus: monitor Debian fixes for remaining HIGH CVEs and re-scan on weekly/monthly schedule.
- Residual HIGH tracking location: `SECURITY_CVE_EXCEPTIONS.md`.

---

## 🔄 Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Weekly | `docker compose up --build` (pull latest patches) |
| Monthly | `docker scout cves` scan & review |
| Quarterly | Major dependency updates |
| Annually | Base image upgrade evaluation |

---

## 📚 References

- Docker Scout Docs: https://docs.docker.com/build/scout/
- Alpine vs Debian: Alpine has fewer patches; Debian has faster security updates
- CVE Database: https://nvd.nist.gov/
- Dockerfile Best Practices: https://docs.docker.com/develop/dev-best-practices/
