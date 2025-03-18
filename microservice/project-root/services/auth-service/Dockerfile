# Sử dụng Node.js 20
FROM node:20.7.0-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để tối ưu layer cache
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --verbose

# Copy toàn bộ source code vào container
COPY . .

# Biên dịch TypeScript
RUN npm run build

# Chạy ứng dụng
CMD ["node", "dist/main.js"]
