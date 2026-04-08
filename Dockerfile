# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci

# Build-time public browser variables only.
# IMPORTANT: never pass secrets here. Anything under VITE_* can end up in the client bundle.
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG PUBLIC_SUPABASE_ANON_KEY
ARG PUBLIC_GOOGLE_MAPS_API_KEY
ARG PUBLIC_ADMIN_USER_ID
ARG PUBLIC_ADMIN_EMAIL

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
    npm run build

FROM nginx:1.27-alpine AS final

# SPA routing fallback + minimal hardening headers.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
