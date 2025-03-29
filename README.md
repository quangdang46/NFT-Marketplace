
# Bảng chi tiết: Chức năng, Người dùng, Microservices với GraphQL và Cơ sở dữ liệu

| **Chức năng**               | **Mô tả**                                                         | **Người dùng** | **Microservices liên quan**                        | **Tương tác**                                                                                   | **GraphQL Query/Mutation**                                                                          | **Cơ sở dữ liệu** | **Trạng thái triển khai**        |
|-----------------------------|-------------------------------------------------------------------|----------------|----------------------------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|-------------------|----------------------------------|
| **Mint NFT (Thủ công)**     | Admin nhập recipient và tokenURI để mint NFT trực tiếp            | Admin          | `nft-service`, `wallet-service`                    | Admin gọi resolver `mintManual` -> `nft-service` mint trên blockchain qua Ankr RPC              | `mutation { mintManual(collectionId: ID!, chain: String!, tokenURI: String!) { txHash, tokenId } }` | MongoDB           | **Đã có (hoàn chỉnh)**           |
| **Mint NFT (Tự động)**      | User tải metadata (tên, mô tả, ảnh) và mint NFT                   | User           | `nft-service`, `wallet-service`                    | User gửi metadata qua resolver -> `nft-service` upload IPFS -> mint                             | `mutation { mintNFT(metadata: MetadataInput!) { txHash, tokenId } }`                                | MongoDB           | Chưa có (cần thêm IPFS)          |
| **Tính phí/Royalty**        | Thu phí Marketplace và royalty khi mua/bán NFT                    | User, Admin    | `transaction-service`, `settings-service`, `nft-service` | `transaction-service` xử lý giao dịch, lấy cấu hình từ `settings-service` (Redis cache)         | `query { getFees { marketplaceFee, royalty } }`                                                     | PostgreSQL, Redis | **Đã có (cơ bản, cần contract)** |
| **Đấu giá (Auction)**       | User đặt giá, đấu giá NFT với thời gian kết thúc                  | User, Admin    | `auction-service`, `transaction-service`, `nft-service` | User gọi `placeBid` -> `auction-service` lưu bid (Redis cache) -> `transaction-service` kết thúc| `mutation { placeBid(auctionId: ID!, amount: Float!) { success, txHash } }`                         | PostgreSQL, Redis | **Đã có (hoàn chỉnh)**           |
| **Lazy Minting**            | NFT chỉ mint khi có người mua, tiết kiệm gas                      | User, Admin    | `nft-service`, `transaction-service`               | User gọi `lazyMintManual` -> `nft-service` lưu metadata -> mint khi bán                        | `mutation { lazyMintManual(collectionId: ID!, chain: String!, tokenURI: String!, royaltyPercentage: Int!, signature: String!) { txHash, tokenId } }` | MongoDB           | **Đã có (hoàn chỉnh)**           |
| **Bộ sưu tập**              | Nhóm NFT thành collections với tên, mô tả, ảnh đại diện           | User, Admin    | `collection-service`, `nft-service`                | User gọi `createCollection` -> `collection-service` deploy contract -> gắn NFT                 | `mutation { createCollection(name: String!, description: String, image: String) { collectionId } }` | MongoDB           | **Đã có (hoàn chỉnh)**           |
| **Tìm kiếm/Lọc**            | Tìm kiếm NFT theo tên, giá, collection, trạng thái, thuộc tính    | User, Admin    | `marketplace-service`, `nft-service`               | User gửi query qua `searchNFTs` -> `marketplace-service` trả về danh sách NFT (Redis cache)     | `query { searchNFTs(query: String, filters: FilterInput) { id, name, price, traits } }`             | MongoDB, Redis    | Chưa có (cần thêm)               |
| **Xác minh**                | Xác minh user/collection để tăng độ tin cậy (dấu tick xanh)       | User, Admin    | `user-service`, `collection-service`               | Admin gọi `verifyUser` -> `user-service` cập nhật trạng thái                                    | `mutation { verifyUser(userId: ID!) { status } }`                                                   | PostgreSQL        | **Đã có (hoàn chỉnh)**           |
| **Giao dịch Off-chain**     | Lưu đơn hàng off-chain, thực hiện on-chain khi khớp               | User, Admin    | `order-service`, `transaction-service`             | User gọi `createOrder` -> `order-service` lưu (Redis cache) -> `transaction-service` khớp lệnh  | `mutation { createOrder(nftId: ID!, price: Float!) { orderId } }`                                   | PostgreSQL, Redis | **Đã có (hoàn chỉnh)**           |
| **Hỗ trợ nhiều chain**      | Mint và giao dịch trên Ethereum, Polygon, v.v.                    | User, Admin    | `nft-service`, `wallet-service`                    | User chọn chain qua resolver -> `nft-service` dùng Ankr RPC tương ứng                          | `query { supportedChains { name, id } }`                                                            | PostgreSQL        | **Đã có (hoàn chỉnh)**           |
| **Hiển thị NFT**            | Hiển thị danh sách NFT để mua/bán trên Marketplace                | User, Admin    | `marketplace-service`, `nft-service`               | User gọi `getMarketplaceNFTs` -> `nft-service` trả dữ liệu (Redis cache)                       | `query { getMarketplaceNFTs(page: Int, limit: Int) { nfts { id, name, tokenURI, owner } } }`        | MongoDB, Redis    | **Đã có (hoàn chỉnh)**           |
| **Kết nối ví**              | Kết nối MetaMask để ký giao dịch (mint, mua, bán)                 | User           | `wallet-service`, frontend                         | Frontend gọi `wallet-service` hoặc MetaMask -> gửi tx đến blockchain                            | (Xử lý ở frontend, không cần GraphQL)                                                               | PostgreSQL        | Chưa có (cần tích hợp frontend)  |
| **Upload IPFS**             | Tự động upload metadata lên IPFS để tạo tokenURI                  | User, Admin    | `nft-service`                                      | `nft-service` nhận metadata -> upload IPFS -> trả về tokenURI                                   | `mutation { uploadMetadata(metadata: MetadataInput!) { tokenURI } }`                                | MongoDB           | Chưa có (cần Pinata)             |
| **Log hành động**           | Ghi lại hành động (login, mint, bán) vào DB                       | Admin          | `nft-service`, `user-service`, log trong DB        | Mỗi service ghi log qua Logger khi có hành động quan trọng                                      | `query { logs { userId, action, timestamp } }`                                                      | PostgreSQL        | **Đã có (cơ bản)**              |
| **Lịch sử giao dịch**       | Hiển thị lịch sử mua/bán/chuyển nhượng của NFT                    | User, Admin    | `transaction-service`, `nft-service`               | User gọi `nftHistory` -> `transaction-service` lấy dữ liệu từ DB                                | `query { nftHistory(nftId: ID!) { txHash, from, to, price, timestamp } }`                           | PostgreSQL        | Chưa có (cần thêm)               |
| **Thuộc tính NFT (Traits)** | Hỗ trợ metadata với thuộc tính (rarity, color) để lọc và hiển thị | User, Admin    | `nft-service`, `marketplace-service`               | `nft-service` lưu traits trong metadata -> `marketplace-service` dùng để lọc                    | `query { nft(id: ID!) { id, name, traits { key, value } } }`                                        | MongoDB           | Chưa có (cần thêm)               |
| **Analytics**               | Thống kê volume, floor price, số NFT của collection               | User, Admin    | `marketplace-service`, `transaction-service`       | User gọi `collectionAnalytics` -> `marketplace-service` tính toán từ dữ liệu (Redis cache)      | `query { collectionAnalytics(collectionId: ID!) { volume, floorPrice, nftCount } }`                 | PostgreSQL, Redis | Chưa có (cần thêm)               |

---

## Giải thích cột "Cơ sở dữ liệu"

### Lý do chọn từng loại database

- **PostgreSQL**: Dùng cho dữ liệu có cấu trúc, cần quan hệ (relational) hoặc giao dịch phức tạp:
  - Quản lý người dùng (`user-service`), ví (`wallet-service`), log (`log`), giao dịch (`transaction-service`), đơn hàng (`order-service`), đấu giá (`auction-service`), cấu hình (`settings-service`).
- **MongoDB**: Dùng cho dữ liệu phi cấu trúc (NoSQL), linh hoạt với JSON:
  - Lưu trữ NFT (`nft-service`), collection (`collection-service`), metadata và traits.
- **Redis**: Dùng cho caching và dữ liệu tạm thời để tăng tốc độ:
  - Cache danh sách NFT (`marketplace-service`), đấu giá (`auction-service`), phí/royalty (`settings-service`).

### Cách kết hợp

- **PostgreSQL + MongoDB**: Dữ liệu giao dịch (PostgreSQL) liên kết với NFT (MongoDB) qua `nftId`.
- **Redis + MongoDB**: Cache danh sách NFT từ MongoDB để hiển thị nhanh trên Marketplace.
- **PostgreSQL + Redis**: Cache cấu hình phí/royalty từ PostgreSQL để giảm truy vấn DB.

---

## Cấu trúc cơ sở dữ liệu cho từng loại

### 1. PostgreSQL

#### Bảng `users` (user-service)

| Column         | Type      | Description            |
|----------------|-----------|------------------------|
| id             | UUID      | Khóa chính             |
| username       | VARCHAR   | Tên người dùng         |
| role           | VARCHAR   | Vai trò (user, admin)  |
| email          | VARCHAR   | Email                  |
| avatar_url     | VARCHAR   | Avatar                 |
| address        | VARCHAR   | Địa chỉ ví             |
| is_verified    | BOOLEAN   | Đã xác minh chưa       |
| created_at     | TIMESTAMP | Thời gian tạo          |

#### Bảng `wallets` (wallet-service)

| Column     | Type      | Description               |
|------------|-----------|---------------------------|
| id         | UUID      | Khóa chính                |
| user_id    | UUID      | FK tới `users`            |
| address    | VARCHAR   | Địa chỉ ví                |
| chain      | VARCHAR   | Blockchain (ETH, Polygon) |
| is_primary | BOOLEAN   | Ví chính hay không        |
| created_at | TIMESTAMP | Thời gian tạo             |

#### Bảng `transactions` (transaction-service)

| Column       | Type      | Description                   |
|--------------|-----------|-------------------------------|
| id           | UUID      | Khóa chính                    |
| nft_id       | VARCHAR   | ID của NFT (liên kết MongoDB) |
| from_address | VARCHAR   | Người gửi                     |
| to_address   | VARCHAR   | Người nhận                    |
| price        | DECIMAL   | Giá giao dịch (ETH)           |
| tx_hash      | VARCHAR   | Hash giao dịch                |
| chain        | VARCHAR   | Blockchain (ETH, Polygon)     |
| status       | VARCHAR   | pending, completed, failed    |
| timestamp    | TIMESTAMP | Thời gian                     |

#### Bảng `logs` (log hành động)

| Column    | Type      | Description             |
|-----------|-----------|-------------------------|
| id        | UUID      | Khóa chính              |
| user_id   | UUID      | FK tới `users`          |
| action    | VARCHAR   | Hành động (login, mint) |
| timestamp | TIMESTAMP | Thời gian               |

#### Bảng `orders` (order-service)

| Column     | Type      | Description                   |
|------------|-----------|-------------------------------|
| id         | UUID      | Khóa chính                    |
| nft_id     | VARCHAR   | ID của NFT (liên kết MongoDB) |
| seller     | VARCHAR   | Địa chỉ người bán             |
| price      | DECIMAL   | Giá đặt                       |
| chain      | VARCHAR   | Blockchain (ETH, Polygon)     |
| buyer      | VARCHAR   | Địa chỉ người mua             |
| status     | VARCHAR   | Trạng thái (open, matched)    |
| created_at | TIMESTAMP | Thời gian tạo                 |

#### Bảng `settings` (settings-service)

| Column     | Type      | Description                 |
|------------|-----------|-----------------------------|
| id         | UUID      | Khóa chính                  |
| key        | VARCHAR   | Tên cấu hình (fee, royalty) |
| value      | VARCHAR   | Giá trị (2.5, 10)           |
| updated_at | TIMESTAMP | Thời gian cập nhật          |

#### Bảng `auctions` (auction-service)

| Column         | Type      | Description                   |
|----------------|-----------|-------------------------------|
| id             | UUID      | Khóa chính                    |
| nft_id         | VARCHAR   | ID của NFT (liên kết MongoDB) |
| starting_price | DECIMAL   | Giá khởi điểm                 |
| current_bid    | DECIMAL   | Giá đấu hiện tại              |
| bidder         | VARCHAR   | Địa chỉ người đấu             |
| seller         | VARCHAR   | Địa chỉ người bán             |
| end_time       | TIMESTAMP | Thời gian kết thúc            |
| chain          | VARCHAR   | Blockchain (ETH, Polygon)     |
| status         | VARCHAR   | active, ended                 |
| created_at     | TIMESTAMP | Thời gian tạo                 |

#### Bảng `chains` (transaction-service, lịch sử giao dịch)

| Column           | Type    | Description                   |
|------------------|---------|-------------------------------|
| id               | UUID    | Khóa chính                    |
| name             | VARCHAR | Tên chain (Ethereum, Polygon) |
| contract_address | VARCHAR | Địa chỉ contract              |
| rpc_url          | VARCHAR | URL RPC của chain (Ankr)      |

---

### 2. MongoDB

#### Collection `nfts` (nft-service)

```json
{
  "_id": ObjectId,
  "tokenId": String,
  "tokenURI": String,
  "owner": String,
  "collectionId": ObjectId,
  "chain": String, // "eth-sepolia", "base-sepolia", "polygon-mumbai"
  "metadata": {
    "name": String,
    "description": String,
    "image": String,
    "traits": [
      { "key": String, "value": String }
    ]
  },
  "isLazy": Boolean,
  "status": String, // "minted", "lazy", "burned"
  "createdAt": Date
}
```

#### Collection `collections` (collection-service)

```json
{
  "_id": ObjectId,
  "creatorId": String, // Liên kết tới users.id trong PostgreSQL
  "creatorRole": String, // "user" hoặc "admin"
  "name": String,
  "description": String,
  "image": String, // Ảnh đại diện chính (ipfs://<hash>)
  "images": [String], // Danh sách ảnh bổ sung (mảng các ipfs://<hash>)
  "isVerified": Boolean, // Đã được admin xác minh chưa
  "chain": String, // "eth-sepolia", "base-sepolia", "polygon-mumbai"
  "nftCount": Number, // Số lượng NFT trong collection
  "contractAddress": String,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 3. Redis

#### Cache `nfts:marketplace` (marketplace-service)

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
  - "0x123:1.5" (Người đấu 0x123, giá 1.5 ETH)
  - "0x456:2.0" (Người đấu 0x456, giá 2.0 ETH)

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
  ```json
  { "volume": 100.5, "floorPrice": 0.5, "nftCount": 50 }
  ```

---
