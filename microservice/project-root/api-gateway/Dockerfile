# Sử dụng Node.js 20
FROM node:20.7.0-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy shared module first
COPY shared/ /app/shared/

# Install and build shared module
WORKDIR /app/shared
RUN npm install --verbose && npm run build

# Switch back to api-gateway directory
WORKDIR /app

# Copy package files from api-gateway directory
COPY api-gateway/package*.json ./

# Install api-gateway dependencies
RUN npm install --verbose

# Copy api-gateway source code
COPY api-gateway/ .

# Biên dịch TypeScript
RUN npm run build

# Chạy ứng dụng
CMD ["node", "dist/main.js"]