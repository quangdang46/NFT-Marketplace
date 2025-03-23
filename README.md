# NFT Marketplace

[English](#english) | [Tiếng Việt](#tiếng-việt)

## English

### Introduction

A decentralized NFT (Non-Fungible Token) marketplace platform that enables users to trade digital assets on multiple blockchains. The platform supports essential features including buying, selling, minting NFTs, and managing digital assets with robust security measures.

### Key Features

- Multi-chain NFT Trading (Ethereum, Solana)
- NFT Minting & Collection Creation
- Secure Wallet Integration
- Advanced Search & Filtering
- User Dashboard
- Admin Management System
- Real-time Price Updates
- Automated Market Making (AMM)

### Technology Stack

#### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui Components
- Web3 Integration (ethers.js, web3.js)
- State Management with Zustand
- Internationalization (i18n)

#### Backend Microservices

- Node.js/Express.js
- Microservice Architecture
- API Gateway
- Service Discovery
- Event-Driven Communication
- MongoDB & Redis

#### Blockchain

- Smart Contracts (Solidity)
- Multi-chain Support
- IPFS for Decentralized Storage
- Wallet Connect Integration

### Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/nft-marketplace.git
cd nft-marketplace
```

2. Setup Environment Variables

```bash
# Frontend
cd frontend
cp .env.example .env.local

# Microservices
cd ../microservice/project-root
cp .env-example .env
```

3. Using Docker (Recommended)

```bash
docker-compose up -d
```

4. Development Environment

```bash
# Frontend
cd frontend
npm install
npm run dev

# Microservices
cd ../microservice/project-root
npm install
npm run dev
```

### Project Structure

```
├── frontend/                # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # Reusable Components
│   │   ├── features/       # Feature Modules
│   │   ├── lib/           # Core Utilities
│   │   └── store/         # State Management
│   └── public/            # Static Assets
└── microservice/          # Backend Microservices
    └── project-root/
        ├── api-gateway/   # API Gateway Service
        ├── services/      # Individual Services
        └── shared/        # Shared Resources
```

### Testing

```bash
# Frontend Tests
cd frontend
npm run test

# Backend Tests
cd ../microservice/project-root
npm run test
```

### Contributing

We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Tiếng Việt

### Giới thiệu

Nền tảng NFT Marketplace phi tập trung cho phép người dùng giao dịch tài sản số trên nhiều blockchain. Nền tảng hỗ trợ các tính năng thiết yếu bao gồm mua, bán, tạo NFT và quản lý tài sản số với các biện pháp bảo mật mạnh mẽ.

### Tính năng chính

- Giao dịch NFT đa chuỗi (Ethereum, ...)
- Tạo NFT & Bộ sưu tập
- Tích hợp ví an toàn
- Tìm kiếm & Lọc nâng cao
- Bảng điều khiển người dùng
- Hệ thống quản trị
- Cập nhật giá thời gian thực
- Tạo thị trường tự động (AMM)

### Công nghệ sử dụng

#### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui Components
- Tích hợp Web3 (ethers.js, web3.js)
- Quản lý trạng thái với Zustand
- Đa ngôn ngữ (i18n)

#### Backend Microservices

- Node.js/Express.js
- Kiến trúc Microservice
- API Gateway
- Service Discovery
- Giao tiếp hướng sự kiện
- MongoDB & Redis

#### Blockchain

- Smart Contracts (Solidity)
- Hỗ trợ đa chuỗi
- IPFS cho lưu trữ phi tập trung
- Tích hợp Wallet Connect

### Cài đặt & Thiết lập

1. Clone repository

```bash
git clone https://github.com/your-username/nft-marketplace.git
cd nft-marketplace
```

2. Thiết lập biến môi trường

```bash
# Frontend
cd frontend
cp .env.example .env.local

# Microservices
cd ../microservice/project-root
cp .env-example .env
```

3. Sử dụng Docker (Khuyến nghị)

```bash
docker-compose up -d
```

4. Môi trường phát triển

```bash
# Frontend
cd frontend
npm install
npm run dev

# Microservices
cd ../microservice/project-root
npm install
npm run dev
```

### Cấu trúc dự án

```
├── frontend/                # Ứng dụng Frontend Next.js
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # Components tái sử dụng
│   │   ├── features/       # Modules tính năng
│   │   ├── lib/           # Tiện ích core
│   │   └── store/         # Quản lý trạng thái
│   └── public/            # Tài nguyên tĩnh
└── microservice/          # Backend Microservices
    └── project-root/
        ├── api-gateway/   # Service API Gateway
        ├── services/      # Các service riêng lẻ
        └── shared/        # Tài nguyên dùng chung
```

### Kiểm thử

```bash
# Kiểm thử Frontend
cd frontend
npm run test

# Kiểm thử Backend
cd ../microservice/project-root
npm run test
```

### Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng xem [Hướng dẫn đóng góp](CONTRIBUTING.md) để biết thêm chi tiết.

### Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
