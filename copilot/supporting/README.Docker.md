## Docker (Vite SPA + Nginx)

This project is built with Vite and served as static files by Nginx.

### Canonical run (recommended)

Use the reset script to remove stale images, rebuild, start, and verify `HEALTHY`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\docker-reset-and-run.ps1
```

### Local run with Compose (manual)

```bash
docker compose up --build
```

App URL: `http://localhost:8090`

### Build image manually

```bash
docker build -t dogyard-atoms-app:latest .
```

### Run image manually

```bash
docker run --rm -p 8090:80 dogyard-atoms-app:latest
```

### Build-time Vite variables

`VITE_*` variables are injected at build time (not runtime) via `compose.yaml` build args.
If you need environment-specific values, rebuild the image per environment.

> Important: only pass **public browser-safe** values via `VITE_*`. Never pass passwords, service-role keys, private API secrets, encryption keys, or database credentials.

### Notes

- SPA routing is handled by `nginx.conf` using `try_files ... /index.html`.
- Static assets under `/assets` are served with long cache headers.
- Full pre-build hardening checklist: `DOCKER_SECURITY_CHECKLIST.md`
- Use one image tag (`dogyard-atoms-app:latest`) to avoid stale IDE `Run` targets.
