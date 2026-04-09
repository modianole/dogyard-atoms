# Nginx Security Headers Configuration

Add these headers to `nginx.conf` for production hardening:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # ===== SECURITY HEADERS =====
  
  # Prevent MIME-type sniffing
  add_header X-Content-Type-Options "nosniff" always;
  
  # Prevent clickjacking (set to Content-Security-Policy origin if needed)
  add_header X-Frame-Options "SAMEORIGIN" always;
  
  # Referrer policy
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  
  # HSTS (enable only after TLS is confirmed working)
  # Tells browsers to always use HTTPS for next 1 year
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  
  # Content Security Policy
  # Restricts resource loading to prevent XSS
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://YOUR_PROJECT_ID.supabase.co https://places.googleapis.com; frame-ancestors 'none';" always;
  
  # Permissions Policy (formerly Feature Policy)
  # Disable dangerous APIs unless explicitly needed
  add_header Permissions-Policy "geolocation=(self), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" always;
  
  # Disable cross-domain policy requests
  add_header X-Permitted-Cross-Domain-Policies "none" always;
  
  # ===== GZIP COMPRESSION =====
  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;

  # ===== CACHE HEADERS =====
  
  # Cache immutable Vite assets aggressively (hash in filename)
  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }

  # ===== SPA ROUTING =====
  
  # Fallback to index.html for BrowserRouter deep links
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Apply Changes

1. Edit `nginx.conf` and add the headers block
2. Rebuild Docker image: `docker compose build`
3. Test locally: `docker compose up -d && curl -I http://localhost:8080`
4. Verify headers appear in response

## Testing

```bash
# Local test
curl -I http://localhost:8080

# Should see all headers:
# Strict-Transport-Security: ...
# Content-Security-Policy: ...
# X-Frame-Options: SAMEORIGIN
# etc.
```

## Notes

- CSP may be restrictive; adjust `script-src` if inline styles/scripts needed
- HSTS requires HTTPS; enable in production only
- Test with OWASP ZAP or other security scanner

