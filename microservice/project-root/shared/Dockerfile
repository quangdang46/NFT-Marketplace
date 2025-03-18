FROM node:20.7.0-alpine

WORKDIR /shared

# Cài npm 10.1.0 để khớp máy cục bộ
RUN npm install -g npm@10.1.0

# Sao chép toàn bộ source code trước npm install
COPY . .

# Cài dependencies
RUN npm install --verbose

# Kiểm tra file trước khi build
RUN ls -la || dir  # Xem file trong /shared

# Build
RUN npm run build

# Kiểm tra output
RUN ls -la /shared/dist || dir /shared/dist
CMD ["echo", "Shared library built"]