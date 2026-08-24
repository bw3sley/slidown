# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

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

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files \$uri =404;
  }
}
EOF

EXPOSE 80
