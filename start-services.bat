@echo off
start cmd /k "cd /d microservice\project-root\api-gateway && npm run start:dev"

start cmd /k "cd /d microservice\project-root\services\auth-service && npm run start:dev"

start cmd /k "cd /d microservice\project-root\services\collection-service && npm run start:dev"


start cmd /k "cd /d microservice\project-root\services\user-service && npm run start:dev"

start cmd /k "cd /d microservice\project-root\services\file-service && npm run start:dev"

start cmd /k "cd /d frontend && npm run dev"

echo All services are starting...
exit