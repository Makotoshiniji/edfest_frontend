# edfest_frontend/Dockerfile

# Stage 1: Build (ใช้ Node สร้างไฟล์ Static)
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production (ใช้ Nginx เสิร์ฟไฟล์)
FROM nginx:stable-alpine as production-stage
# ก๊อปปี้ไฟล์ที่ Build เสร็จแล้วไปใส่ใน Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# ก๊อปปี้ไฟล์ Config ของ Nginx (ที่เราจะสร้างใน Step 3)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]