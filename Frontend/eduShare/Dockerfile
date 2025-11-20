# STAGE 1: Build Angular
FROM node:18 AS build
WORKDIR /usr/src/app

# Másoljuk csak a package fájlokat, gyorsabb cache miatt
COPY package.json package-lock.json ./
RUN npm ci

# Másoljuk az összes Angular forrást
COPY . .

# Build konfigurációtól függően: production vagy development
ARG CONFIG=production
RUN npm run build -- --configuration production

# STAGE 2: Nginx serve
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/edu-share/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx foregroundban
CMD ["nginx", "-g", "daemon off;"]
