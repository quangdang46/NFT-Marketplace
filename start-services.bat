@echo off

:: Khởi động auth-service
start cmd /k "cd /d microservice\project-root\services\auth-service && npm run start:dev"



:: Khởi động api-gateway
start cmd /k "cd /d microservice\project-root\api-gateway && npm run start:dev"

:: Khởi động user-service
start cmd /k "cd /d microservice\project-root\services\user-service && npm run start:dev"

:: Khởi động user-service
start cmd /k "cd /d microservice\project-root\services\nft-service && npm run start:dev"

:: Khởi động frontend
start cmd /k "cd /d frontend && npm run dev"

echo All services are starting...
exit