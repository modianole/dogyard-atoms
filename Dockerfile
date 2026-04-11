# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Build-time public browser variables only.
# IMPORTANT: never pass secrets here. Anything under VITE_* can end up in the client bundle.
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG PUBLIC_SUPABASE_ANON_KEY
ARG PUBLIC_GOOGLE_MAPS_API_KEY
ARG PUBLIC_ADMIN_USER_ID
ARG PUBLIC_ADMIN_EMAIL
ARG PUBLIC_DEVELOPER_EMAILS
ARG PUBLIC_DEVELOPER_EMAIL

COPY index.html ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY components.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY public ./public
COPY src ./src

RUN VITE_SUPABASE_URL="$PUBLIC_SUPABASE_URL" \
    VITE_SUPABASE_PUBLISHABLE_KEY="$PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
    VITE_SUPABASE_ANON_KEY="$PUBLIC_SUPABASE_ANON_KEY" \
    VITE_GOOGLE_MAPS_API_KEY="$PUBLIC_GOOGLE_MAPS_API_KEY" \
    VITE_ADMIN_USER_ID="$PUBLIC_ADMIN_USER_ID" \
    VITE_ADMIN_EMAIL="$PUBLIC_ADMIN_EMAIL" \
    VITE_DEVELOPER_EMAILS="$PUBLIC_DEVELOPER_EMAILS" \
    VITE_DEVELOPER_EMAIL="$PUBLIC_DEVELOPER_EMAIL" \
    npm run build

FROM nginx:1.27 AS final

# Default runtime port for local/container runs; Cloud Run can override via PORT.
ENV PORT=8082

RUN apt-get update \
 && apt-get upgrade -y \
 && rm -rf /var/lib/apt/lists/*

# Fix permissions for nginx when running as non-root (10001:10001)
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/run/nginx \
 && chown -R 10001:10001 /var/cache/nginx /var/run /var/log/nginx /var/run/nginx \
 && sed -i 's|^pid .*|pid /var/run/nginx/nginx.pid;|' /etc/nginx/nginx.conf

# Keep this as a template so nginx can bind to runtime $PORT on Cloud Run.
RUN mkdir -p /etc/nginx/templates
COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN chown -R 10001:10001 /etc/nginx/conf.d /etc/nginx/templates

# SPA routing fallback + minimal hardening headers.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:8082/ >/dev/null || exit 1

USER 10001:10001

CMD ["nginx", "-g", "daemon off;"]
