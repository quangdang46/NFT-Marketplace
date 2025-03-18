npx @nestjs/cli new auth-service
cd auth-service
npm install
npm install @nestjs/microservices amqplib @nestjs/config consul 

docker system prune -a --volumes
docker-compose up --build 

'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],