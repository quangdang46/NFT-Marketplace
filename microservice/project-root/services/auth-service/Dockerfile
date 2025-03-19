# Sử dụng Node.js 20
FROM node:20.7.0-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy shared module first
COPY shared/ /app/shared/

# Install and build shared module
WORKDIR /app/shared
RUN npm install --verbose && npm run build

# Switch back to auth-service directory
WORKDIR /app

# Copy package files from auth-service directory
COPY services/auth-service/package*.json ./

# Install auth-service dependencies
RUN npm install --verbose

# Copy auth-service source code
COPY services/auth-service/ .

# Biên dịch TypeScript
RUN npm run build

# Chạy ứng dụng
CMD ["node", "dist/main.js"]
