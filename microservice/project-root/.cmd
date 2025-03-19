npx @nestjs/cli new auth-service
cd auth-service
npm install
npm install @nestjs/microservices amqplib @nestjs/config consul 

docker system prune -a --volumes
docker-compose up -d


     "@project/shared": ["/app/shared/dist"],
      "@project/shared/*": ["/app/shared/dist/*"],
      "interfaces/*": ["/app/shared/dist/interfaces/*"]


'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],