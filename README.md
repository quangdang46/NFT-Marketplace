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
- MongoDB & Redis,Postgresql

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
- MongoDB & Redis,Postgresql

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

# Bảng chi tiết: Chức năng, Người dùng, Microservices với GraphQL và Cơ sở dữ liệu

| **Chức năng**               | **Mô tả**                                                         | **Người dùng** | **Microservices liên quan**                        | **Tương tác**                                                                                   | **GraphQL Query/Mutation**                                                                          | **Cơ sở dữ liệu** | **Trạng thái triển khai**        |
| --------------------------- | ----------------------------------------------------------------- | -------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------- |
| **Mint NFT (Thủ công)**     | Admin nhập recipient và tokenURI để mint NFT trực tiếp            | Admin          | nft-service, wallet-service                        | Admin gọi API `/nfts/manual` -> `nft-service` mint trên blockchain                              | `mutation { mintManual(recipient: String!, tokenURI: String!) { txHash, tokenId } }`                | MongoDB           | Đã có (cơ bản)                   |
| **Mint NFT (Tự động)**      | User tải metadata (tên, mô tả, ảnh) và mint NFT                   | User           | nft-service, wallet-service                        | User gửi metadata qua `/nfts/mint` -> `nft-service` upload IPFS -> mint                         | `mutation { mintNFT(metadata: MetadataInput!) { txHash, tokenId } }`                                | MongoDB           | Chưa có (cần thêm)               |
| **Tính phí/Royalty**        | Thu phí Marketplace và royalty khi mua/bán NFT                    | User, Admin    | transaction-service, settings-service, nft-service | `transaction-service` xử lý giao dịch, gửi phí/royalty theo cấu hình từ `settings-service`      | `query { getFees { marketplaceFee, royalty } }`                                                     | PostgreSQL, Redis | Chưa có (cần smart contract mới) |
| **Đấu giá (Auction)**       | User đặt giá, đấu giá NFT với thời gian kết thúc                  | User, Admin    | auction-service, transaction-service, nft-service  | User gọi `/auctions/bid` -> `auction-service` lưu bid -> `transaction-service` kết thúc đấu giá | `mutation { placeBid(auctionId: ID!, amount: Float!) { success } }`                                 | PostgreSQL, Redis | Chưa có (cần service mới)        |
| **Lazy Minting**            | NFT chỉ mint khi có người mua, tiết kiệm gas                      | User, Admin    | nft-service, transaction-service                   | User tạo NFT qua `/nfts/lazy` -> `nft-service` lưu metadata -> mint khi bán                     | `mutation { createLazyNFT(metadata: MetadataInput!) { nftId, tokenURI } }`                          | MongoDB           | Chưa có (cần thêm)               |
| **Bộ sưu tập**              | Nhóm NFT thành collections với tên, mô tả, ảnh đại diện           | User, Admin    | collection-service, nft-service                    | User tạo collection qua `/collections` -> `nft-service` gắn NFT vào collection                  | `mutation { createCollection(name: String!, description: String, image: String) { collectionId } }` | MongoDB           | Chưa có (cần service mới)        |
| **Tìm kiếm/Lọc**            | Tìm kiếm NFT theo tên, giá, collection, trạng thái, thuộc tính    | User, Admin    | marketplace-service, nft-service                   | User gửi query qua `/marketplace/search` -> `marketplace-service` trả về danh sách NFT          | `query { searchNFTs(query: String, filters: FilterInput) { id, name, price, traits } }`             | MongoDB, Redis    | Chưa có (cần thêm)               |
| **Xác minh**                | Xác minh user/collection để tăng độ tin cậy (dấu tick xanh)       | User, Admin    | user-service, collection-service                   | User yêu cầu qua `/users/verify` -> Admin duyệt trong `user-service`                            | `mutation { verifyUser(userId: ID!) { success } }`                                                  | PostgreSQL        | Chưa có (cần thêm)               |
| **Giao dịch Off-chain**     | Lưu đơn hàng off-chain, thực hiện on-chain khi khớp               | User, Admin    | order-service, transaction-service                 | User tạo order qua `/orders` -> `order-service` lưu -> `transaction-service` khớp lệnh          | `mutation { createOrder(nftId: ID!, price: Float!) { orderId } }`                                   | PostgreSQL, Redis | Chưa có (cần service mới)        |
| **Hỗ trợ nhiều chain**      | Mint và giao dịch trên Ethereum, Polygon, v.v.                    | User, Admin    | nft-service, wallet-service                        | User chọn chain qua frontend -> `nft-service` dùng provider phù hợp                             | `query { supportedChains { name, id } }`                                                            | PostgreSQL        | Chưa có (cần cấu hình)           |
| **Hiển thị NFT**            | Hiển thị danh sách NFT để mua/bán trên Marketplace                | User, Admin    | marketplace-service, nft-service                   | User truy cập `/marketplace` -> `marketplace-service` lấy dữ liệu từ `nft-service`              | `query { nfts { id, name, tokenURI, owner } }`                                                      | MongoDB, Redis    | Đã có (cơ bản)                   |
| **Kết nối ví**              | Kết nối MetaMask để ký giao dịch (mint, mua, bán)                 | User           | wallet-service, frontend                           | Frontend gọi `wallet-service` hoặc MetaMask -> gửi tx đến blockchain                            | (Xử lý ở frontend, không cần GraphQL)                                                               | PostgreSQL        | Chưa có (cần tích hợp frontend)  |
| **Upload IPFS**             | Tự động upload metadata lên IPFS để tạo tokenURI                  | User, Admin    | nft-service                                        | `nft-service` nhận metadata -> upload IPFS -> trả về tokenURI                                   | `mutation { uploadMetadata(metadata: MetadataInput!) { tokenURI } }`                                | MongoDB           | Chưa có (cần Pinata)             |
| **Log hành động**           | Ghi lại hành động (login, mint, bán) vào DB                       | Admin          | nft-service, user-service, log trong DB            | Mỗi service ghi log vào DB khi có hành động quan trọng                                          | `query { logs { userId, action, timestamp } }`                                                      | PostgreSQL        | Đã có (cơ bản)                   |
| **Lịch sử giao dịch**       | Hiển thị lịch sử mua/bán/chuyển nhượng của NFT                    | User, Admin    | transaction-service, nft-service                   | User truy cập `/nfts/:id/history` -> `transaction-service` lấy dữ liệu từ blockchain/DB         | `query { nftHistory(nftId: ID!) { txHash, from, to, price, timestamp } }`                           | PostgreSQL        | Chưa có (cần thêm)               |
| **Thuộc tính NFT (Traits)** | Hỗ trợ metadata với thuộc tính (rarity, color) để lọc và hiển thị | User, Admin    | nft-service, marketplace-service                   | `nft-service` lưu traits trong metadata -> `marketplace-service` dùng để lọc                    | `query { nft(id: ID!) { id, name, traits { key, value } } }`                                        | MongoDB           | Chưa có (cần thêm)               |
| **Analytics**               | Thống kê volume, floor price, số NFT của collection               | User, Admin    | marketplace-service, transaction-service           | User truy cập `/collections/:id/analytics` -> `marketplace-service` tính toán từ dữ liệu        | `query { collectionAnalytics(collectionId: ID!) { volume, floorPrice, nftCount } }`                 | PostgreSQL, Redis | Chưa có (cần thêm)               |

---

## Giải thích cột "Cơ sở dữ liệu"

### Lý do chọn từng loại database

- **PostgreSQL**: Dùng cho dữ liệu có cấu trúc, cần quan hệ (relational) hoặc giao dịch phức tạp:
  - Quản lý người dùng (`user-service`), ví (`wallet-service`), log (`log`), giao dịch (`transaction-service`).
  - Lưu trữ cấu hình chain (`nft-service`), đơn hàng (`order-service`), và xác minh (`user-service`).
- **MongoDB**: Dùng cho dữ liệu phi cấu trúc (NoSQL), linh hoạt với JSON:
  - Lưu trữ NFT (`nft-service`), collection (`collection-service`), metadata và traits.
  - Phù hợp với dữ liệu không cố định như metadata NFT (tên, mô tả, ảnh, traits).
- **Redis**: Dùng cho caching và dữ liệu tạm thời để tăng tốc độ:
  - Cache danh sách NFT (`marketplace-service`), kết quả tìm kiếm/lọc, phí/royalty (`settings-service`).
  - Lưu trạng thái đấu giá (`auction-service`), đơn hàng tạm thời (`order-service`).

### Cách kết hợp

- **PostgreSQL + MongoDB**: Dữ liệu giao dịch (PostgreSQL) liên kết với NFT (MongoDB) qua `nftId`.
- **Redis + MongoDB**: Cache danh sách NFT từ MongoDB để hiển thị nhanh trên Marketplace.
- **PostgreSQL + Redis**: Cache cấu hình phí/royalty từ PostgreSQL để giảm truy vấn DB.

---

## Cấu trúc cơ sở dữ liệu cho từng loại

### 1. PostgreSQL

#### Bảng `users` (user-service)

| Column         | Type      | Description      |
| -------------- | --------- | ---------------- |
| id             | UUID      | Khóa chính       |
| username       | VARCHAR   | Tên người dùng   |
| email          | VARCHAR   | Email            |
| wallet_address | VARCHAR   | Địa chỉ ví       |
| is_verified    | BOOLEAN   | Đã xác minh chưa |
| created_at     | TIMESTAMP | Thời gian tạo    |

#### Bảng `wallets` (wallet-service)

| Column     | Type      | Description               |
| ---------- | --------- | ------------------------- |
| id         | UUID      | Khóa chính                |
| user_id    | UUID      | FK tới `users`            |
| address    | VARCHAR   | Địa chỉ ví                |
| chain      | VARCHAR   | Blockchain (ETH, Polygon) |
| created_at | TIMESTAMP | Thời gian tạo             |

#### Bảng `transactions` (transaction-service)

| Column       | Type      | Description                   |
| ------------ | --------- | ----------------------------- |
| id           | UUID      | Khóa chính                    |
| nft_id       | VARCHAR   | ID của NFT (liên kết MongoDB) |
| from_address | VARCHAR   | Người gửi                     |
| to_address   | VARCHAR   | Người nhận                    |
| price        | DECIMAL   | Giá giao dịch (ETH)           |
| tx_hash      | VARCHAR   | Hash giao dịch                |
| timestamp    | TIMESTAMP | Thời gian                     |

#### Bảng `logs` (log hành động)

| Column    | Type      | Description             |
| --------- | --------- | ----------------------- |
| id        | UUID      | Khóa chính              |
| user_id   | UUID      | FK tới `users`          |
| action    | VARCHAR   | Hành động (login, mint) |
| timestamp | TIMESTAMP | Thời gian               |

#### Bảng `orders` (order-service)

| Column     | Type      | Description                   |
| ---------- | --------- | ----------------------------- |
| id         | UUID      | Khóa chính                    |
| nft_id     | VARCHAR   | ID của NFT (liên kết MongoDB) |
| seller     | VARCHAR   | Địa chỉ người bán             |
| price      | DECIMAL   | Giá đặt                       |
| status     | VARCHAR   | Trạng thái (open, matched)    |
| created_at | TIMESTAMP | Thời gian tạo                 |

#### Bảng `settings` (settings-service)

| Column     | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | UUID      | Khóa chính                  |
| key        | VARCHAR   | Tên cấu hình (fee, royalty) |
| value      | VARCHAR   | Giá trị (2.5, 10)           |
| updated_at | TIMESTAMP | Thời gian cập nhật          |

#### Bảng `aunctions` (auction-service)

| Column         | Type      | Description                   |
| -------------- | --------- | ----------------------------- |
| id             | UUID      | Khóa chính                    |
| nft_id         | VARCHAR   | ID của NFT (liên kết MongoDB) |
| starting_price | DECIMAL   | Giá khởi điểm                 |
| current_bid    | DECIMAL   | Giá đấu hiện tại              |
| bidder         | VARCHAR   | Địa chỉ người đấu             |
| end_time       | TIMESTAMP | Thời gian kết thúc            |
| created_at     | TIMESTAMP | Thời gian tạo                 |

#### Bảng `chains` (transaction-service, lịch sử giao dịch)

| Column  | Type    | Description                   |
| ------- | ------- | ----------------------------- |
| id      | UUID    | Khóa chính                    |
| name    | VARCHAR | Tên chain (Ethereum, Polygon) |
| rpc_url | VARCHAR | URL RPC của chain             |

---

### 2. MongoDB

#### Collection `nfts` (nft-service)

```json
{
  "_id": ObjectId,
  "tokenId": String,
  "tokenURI": String,
  "owner": String, // Địa chỉ ví
  "collectionId": ObjectId, // Liên kết tới collections
  "metadata": {
    "name": String,
    "description": String,
    "image": String,
    "traits": [
      { "key": String, "value": String } // Ví dụ: {"key": "Color", "value": "Blue"}
    ]
  },
  "isLazy": Boolean,
  "createdAt": Date
}
```

#### Collection `collections` (collection-service)

```json
{
  "_id": ObjectId,
  "userId": String, // Liên kết tới users trong PostgreSQL
  "name": String,
  "description": String,
  "image": String, // Ảnh đại diện
  "createdAt": Date
}
```

### 3. Redis

- **Key**: `nfts:marketplace:<page>` (Ví dụ: `nfts:marketplace:1`)
- **Value**: JSON string của danh sách NFT (lấy từ MongoDB)
- **TTL**: 5 phút
- **Ví dụ nội dung**:
  ```json
  {
    "nfts": [
      { "id": "1", "name": "NFT 1", "tokenURI": "ipfs://abc", "owner": "0x123" }
    ]
  }
  ```

#### Cache `auction_bids` (auction-service)

- **Key**: `auction:<auctionId>:bids` (Ví dụ: `auction:123:bids`)
- **Value**: List các bid (bidder, amount)
- **TTL**: Hết thời gian đấu giá
- **Ví dụ nội dung**:
  ```markdown
  - "0x123:1.5" (Người đấu 0x123, giá 1.5 ETH)
  - "0x456:2.0" (Người đấu 0x456, giá 2.0 ETH)
  ```


#### Cache `settings` (settings-service)

- **Key**: `settings:fees`
- **Value**: JSON string chứa cấu hình phí và royalty
- **TTL**: 1 giờ
- **Ví dụ nội dung**:
  ```json
  { "marketplaceFee": 2.5, "royalty": 10 }
  ```


#### Cache `search_results` (marketplace-service)

- **Key**: `search:<query>:<filters>` (Ví dụ: `search:nft:price_1-5`)
- **Value**: JSON string của kết quả tìm kiếm/lọc
- **TTL**: 5 phút
- **Ví dụ nội dung**:
  ```json
  {
    "results": [{ "id": "1", "name": "NFT 1", "price": 1.0 }]
  }
  ```


#### Cache `analytics` (marketplace-service)

- **Key**: `analytics:collection:<collectionId>` (Ví dụ: `analytics:collection:abc123`)
- **Value**: JSON string chứa số liệu thống kê
- **TTL**: 10 phút
- **Ví dụ nội dung**:
  ````json
  { "volume": 100.5, "floorPrice": 0.5, "nftCount": 50 }
  ````

