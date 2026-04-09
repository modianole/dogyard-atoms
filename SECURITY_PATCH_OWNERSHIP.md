# Security Patch Ownership

This runbook defines ownership and cadence for container security patching and CVE review.

## Cadence

- Weekly: rebuild image with latest Debian patches.
- Monthly: run full CVE review and exception audit.
- Quarterly: dependency and base-image strategy review.

## Weekly Procedure (Patch Window)

1. Run rebuild:

```powershell
docker compose -f "C:\Users\user\StudioProjects\dogyard-atoms\compose.yaml" up --build -d
```

2. Verify runtime security posture:

```powershell
docker inspect dogyard-atoms-app-1 --format "health={{.State.Health.Status}}"
docker inspect dogyard-atoms-app-1 --format "user={{.Config.User}}"
```

3. Run CVE scan and capture output:

```powershell
docker scout cves dogyard-atoms:local
```

4. Update:
- `SECURITY_CVE_REMEDIATION.md` with new counts.
- `SECURITY_CVE_EXCEPTIONS.md` for any unresolved HIGH/CRITICAL CVEs.

## Escalation Policy

- Any `CRITICAL` finding: open incident immediately and block release.
- Any `HIGH` finding with available fix: patch in the next patch window.
- Any `HIGH` finding without fix: add/update exception with review date <= 30 days.

## Ownership Template

Fill these values in your internal tracker:

- Security owner: `<name>`
- Engineering owner: `<name>`
- Backup approver: `<name>`
- Incident channel: `<channel>`

## Evidence Retention

For each monthly review, keep:

- Docker Scout output snapshot
- CI artifact references from `.github/workflows/cve-scan.yml`
- Link to commit that updated `SECURITY_CVE_REMEDIATION.md`

