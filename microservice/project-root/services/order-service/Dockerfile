FROM node:20.7.0-alpine
WORKDIR /app
COPY shared/ /app/shared/
WORKDIR /app/shared
RUN npm install --verbose && npm run build
WORKDIR /app
COPY services/order-service/package*.json ./
RUN npm install --verbose
COPY services/order-service/ .
RUN npm run build

CMD ["node", "dist/main.js"]