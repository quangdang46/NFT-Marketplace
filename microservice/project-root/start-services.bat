@echo off
:: Khởi động api-gateway
start cmd /k "cd /d api-gateway && npm run start:dev"

:: Khởi động auth-service
start cmd /k "cd /d services\auth-service && npm run start:dev"

:: Khởi động user-service
start cmd /k "cd /d services\user-service && npm run start:dev"

echo All services are starting...
exit
