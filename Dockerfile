# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  types {
    application/manifest+json webmanifest;
  }
  include /etc/nginx/mime.types;

  gzip on;
  gzip_vary on;
  gzip_types text/css application/javascript application/json image/svg+xml application/manifest+json;

  # Always revalidate the shell so new deploys are picked up.
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # Vite fingerprints everything in /assets, so it is safe to cache forever.
  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files \$uri =404;
  }

  # Unhashed public files (og-image.png, favicon, manifest) must be able to change.
  location ~* \.(png|jpg|jpeg|gif|svg|ico|webp|webmanifest|woff|woff2)$ {
    add_header Cache-Control "public, max-age=86400";
    try_files \$uri =404;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

EXPOSE 80
