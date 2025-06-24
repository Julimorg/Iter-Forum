# Dùng image Node.js phiên bản 18 làm base -> Môi trường để build và chạy application
FROM node:18-slim
# Tạo thư mục là "app" trong Docker Container. 
WORKDIR /app
# Copy các package vào app 
COPY package.json package-lock.json ./
# Cài đặt dependency
RUN npm install
# Copy toàn bộ code base
COPY . .
# Build application
RUN npm run build
# Cài đặt server
RUN npm install -g serve
# Expose gatewate
EXPOSE 3000
# chạy application
CMD ["serve", "-s", "dist", "-l", "3000"]