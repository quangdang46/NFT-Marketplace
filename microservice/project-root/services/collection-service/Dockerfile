# Dockerfile
# Sử dụng Node.js 20 làm base image
FROM node:20.7.0-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy shared module trước
COPY shared/ /app/shared/

# Cài đặt và build shared module
WORKDIR /app/shared
RUN npm install --verbose && npm run build

# Quay lại thư mục chính của collection-service
WORKDIR /app

# Copy package.json và package-lock.json
COPY services/collection-service/package*.json ./

# Cài đặt dependencies
RUN npm install --verbose

# Copy toàn bộ mã nguồn của collection-service
COPY services/collection-service/ .

# Build mã nguồn
RUN npm run build

# Chạy ứng dụng
CMD ["node", "dist/main.js"]