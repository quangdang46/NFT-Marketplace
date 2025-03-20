npx @nestjs/cli new auth-service
cd auth-service
npm install
npm install @nestjs/microservices amqplib amqp-connection-manager consul 

docker system prune -a --volumes
docker-compose up -d

docker run -d -p 8500:8500 consul
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

     "@project/shared": ["/app/shared/dist"],
      "@project/shared/*": ["/app/shared/dist/*"],
      "interfaces/*": ["/app/shared/dist/interfaces/*"]


'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],