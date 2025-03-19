
FROM node:20.7.0-alpine

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache git

# Đặt thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies và rimraf toàn cục
RUN npm install --verbose && npm install -g rimraf

# Copy source code
COPY src/ ./src/
COPY tsconfig.json package.json ./

# Build thư viện shared
RUN npm run build

# Kiểm tra output
RUN ls -la dist

# Đảm bảo dist folder được tạo và có các file cần thiết
RUN test -d dist && test -f dist/index.js && test -f dist/index.d.ts

# Expose dist folder như một volume
VOLUME ["/app/dist"]

# Giữ container chạy để các service khác có thể sử dụng volume
CMD ["tail", "-f", "/dev/null"]