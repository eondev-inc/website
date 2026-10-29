# Stage 1: Build
FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production-stage

# SPA nginx config: serve the app under /website/ (matches Vite base)
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Emit a relative Location so the browser keeps the current host:port.
  # With the default absolute_redirect, nginx rebuilds the URL from its own
  # listen port and drops the port when it is not 80.
  absolute_redirect off;

  location = / {
    return 302 /website/;
  }

  location /website/ {
    alias /usr/share/nginx/html/;
    try_files $uri $uri/ /index.html;
  }
}
EOF

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

# The nginx master must stay root: it binds :80 and creates /var/cache/nginx/*.
# Worker processes still drop to the unprivileged 'nginx' user via the
# 'user nginx;' directive in the base image's nginx.conf.
