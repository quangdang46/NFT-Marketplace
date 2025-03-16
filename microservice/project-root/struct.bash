/project-root/
├── services/              
│   ├── auth-service/ 
│   │   ├── src/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── v1/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   ├── constants/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
├── api-gateway/
│   ├── src/
│   │   ├── config/
│   │   │   ├── service-discovery.config.ts
│   │   ├── v1/
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.service.ts
│   │   ├── gateway.module.ts
│   │   ├── main.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
├── shared/
│   ├── utils/
│   ├── interfaces/
│   ├── constants/
│   ├── middlewares/
│   ├── exceptions/
│   ├── decorators/
│   ├── events/
│   │   ├── base.event.ts 
│   │   ├── saga.interface.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.ts
├── infrastructure/
│   ├── consul/
│   │   ├── consul-config.json
│   ├── rabbitmq/
│   │   ├── rabbitmq.conf
├── docker-compose.yml 
├── .env
├── .gitignore
├── README.md