@echo off
start cmd /k "cd /d microservice\project-root\api-gateway && npm run start:dev"

start cmd /k "cd /d microservice\project-root\services\auction-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\auth-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\chain-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\collection-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\log-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\nft-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\order-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\settings-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\test-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\transaction-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\user-service && npm run start:dev"
start cmd /k "cd /d microservice\project-root\services\wallet-service && npm run start:dev"


start cmd /k "cd /d frontend && npm run dev"

echo All services are starting...
exit