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

COPY services/user-service/package*.json ./

RUN npm install --verbose

COPY services/user-service/ .

RUN npm run build

CMD ["node", "dist/main.js"]
