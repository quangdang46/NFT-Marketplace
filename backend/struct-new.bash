backend/
├── src/
│   ├── core/                  # Chứa logic cốt lõi, không phụ thuộc module
│   │   ├── domain/            # Domain-Driven Design (nếu áp dụng)
│   │   │   ├── entities/      # Các entity chính (User, NFT, Transaction)
│   │   │   ├── repositories/  # Interface cho repository
│   │   │   ├── services/      # Business logic độc lập
│   │   ├── exceptions/        # Custom exceptions
│   │   ├── interfaces/        # TypeScript interfaces chung
│   │   ├── constants/         # Hằng số toàn cục
│   ├── modules/              # Tất cả các module nghiệp vụ
│   │   ├── auth/             # Như hiện tại
│   │   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── interfaces/            # Interfaces cho module
│   │   │   ├── guards/               # Auth guards
│   │   │   ├── strategies/          # Passport strategies
│   │   │   ├── v1/                  # API version 1
│   │   │   │   ├── auth.controller.ts    # Controllers
│   │   │   │   ├── auth.service.ts       # Services
│   │   │   ├── constants/        # Constants cho auth
│   │   │   ├── auth.module.ts   # Module definition
│   │   │   └── auth.types.ts   # Type definitions
│   │   ├── nft/              # Như hiện tại
│   │   ├── user/             # Như hiện tại
│   │   ├── blockchain/       # Module blockchain
│   │   │   ├── adapters/     # Adapter cho từng blockchain (SolanaAdapter, EthereumAdapter)
│   │   │   ├── interfaces/   # Interface chung cho blockchain
│   │   │   ├── blockchain.module.ts
│   │   │   ├── blockchain.service.ts
│   │   ├── payment/          # Module xử lý thanh toán (nếu thêm sau)
│   │   ├── notification/     # Module thông báo (email, push notification)
│   ├── infrastructure/       # Chứa các triển khai cụ thể (DB, external services)
│   │   ├── database/         # Như hiện tại
│   │   ├── cache/            # Redis, Memcached, v.v.
│   │   ├── file-storage/     # AWS S3, Google Cloud Storage
│   ├── shared/               # Thay thế common/ và utils/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   ├── utils/            # Helper functions
│   ├── config/               # Như hiện tại
│   ├── app.module.ts
│   ├── main.ts
├── Dockerfile                # Nếu deploy bằng Docker
├── docker-compose.yml        # Nếu dùng microservices




/project-root/
├── services/                   # Chứa tất cả các microservices
│   ├── auth-service/          # Microservice xác thực
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
│   ├── user-service/         # Microservice quản lý user
│   │   ├── src/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── v1/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   ├── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   ├── nft-service/          # Microservice NFT
│   │   ├── src/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── events/       # Thêm để hỗ trợ Saga Pattern
│   │   │   │   ├── nft-created.event.ts
│   │   │   │   ├── nft-creation-failed.event.ts
│   │   │   ├── v1/
│   │   │   │   ├── nft.controller.ts
│   │   │   │   ├── nft.service.ts
│   │   │   ├── nft.module.ts
│   │   │   ├── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   ├── blockchain-service/   # Microservice blockchain
│   │   ├── src/
│   │   │   ├── adapters/
│   │   │   ├── interfaces/
│   │   │   ├── events/       # Thêm để hỗ trợ Saga Pattern
│   │   │   │   ├── blockchain-minted.event.ts
│   │   │   ├── v1/
│   │   │   │   ├── blockchain.controller.ts
│   │   │   │   ├── blockchain.service.ts
│   │   │   ├── blockchain.module.ts
│   │   │   ├── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
├── api-gateway/              # API Gateway cải tiến
│   ├── src/
│   │   ├── config/           # Cấu hình Service Discovery
│   │   │   ├── service-discovery.config.ts
│   │   ├── v1/
│   │   │   ├── gateway.controller.ts
│   │   │   ├── gateway.service.ts
│   │   ├── gateway.module.ts
│   │   ├── main.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
├── shared/                   # Thư viện dùng chung
│   ├── utils/
│   ├── interfaces/
│   ├── constants/
│   ├── middlewares/
│   ├── exceptions/
│   ├── decorators/
│   ├── events/              # Thêm để hỗ trợ Saga Pattern
│   │   ├── base.event.ts    # Event cơ bản
│   │   ├── saga.interface.ts # Interface cho Saga
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.ts
├── infrastructure/           # Cơ sở hạ tầng hỗ trợ
│   ├── consul/              # Service Discovery với Consul
│   │   ├── consul-config.json
│   ├── rabbitmq/            # Message Broker cho Saga Pattern
│   │   ├── rabbitmq.conf
├── docker-compose.yml        # Quản lý toàn bộ hệ thống
├── .env
├── .gitignore
├── README.md