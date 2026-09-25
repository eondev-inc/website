# Stage 1: Build
FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
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

USER nginx
