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