# Security CVE Exceptions Register

This file tracks temporarily accepted vulnerabilities that cannot be remediated immediately due to unavailable upstream fixes.

## Active Exceptions

| CVE | Package | Severity | Detected | Fix Available | Compensating Controls | Owner | Review By | Status |
|-----|---------|----------|----------|---------------|-----------------------|-------|-----------|--------|
| CVE-2026-33164 | libde265 | HIGH | 2026-04-10 | No (`not fixed` in Debian Bookworm stream) | Non-root runtime (`10001:10001`), read-only root FS, dropped Linux capabilities, weekly rebuild + monthly CVE scan | Security owner | 2026-05-10 | Open |
| CVE-2026-27135 | nghttp2 | HIGH | 2026-04-10 | No (`not fixed` in Debian Bookworm stream) | Non-root runtime (`10001:10001`), read-only root FS, dropped Linux capabilities, weekly rebuild + monthly CVE scan | Security owner | 2026-05-10 | Open |

## Exit Criteria

An exception can be closed when all of the following are true:

1. A fixed package version exists in the base image package stream.
2. `docker compose up --build -d` completes successfully on the updated image.
3. `docker scout cves dogyard-atoms:local` no longer reports the CVE.
4. `SECURITY_CVE_REMEDIATION.md` is updated with closure evidence.

## Operational Notes

- Exceptions are temporary and must be reviewed on or before the `Review By` date.
- If an exception remains open after the review date, open an incident ticket and escalate to engineering lead/security owner.

