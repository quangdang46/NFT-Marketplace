# NFT Marketplace Frontend

## Giới thiệu

Đây là phần frontend của dự án NFT Marketplace, một nền tảng cho phép người dùng mua bán, đấu giá và quản lý NFT. Dự án được xây dựng với Next.js và tích hợp với nhiều blockchain khác nhau.

## Công nghệ sử dụng

- Next.js 13+ với App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Redux Toolkit cho state management
- Jest cho unit testing

## Cấu trúc thư mục

```
src/
├── app/                  # App router và layout chính
├── components/           # Các component dùng chung
├── features/             # Các tính năng chính của ứng dụng
│   ├── nfts/             # Chức năng liên quan đến NFT
│   ├── collections/      # Quản lý bộ sưu tập NFT
│   ├── profile/          # Trang cá nhân người dùng
│   └── wallets/          # Tích hợp ví điện tử
├── lib/                  # Utilities và services
│   ├── blockchain/       # Tích hợp blockchain
│   └── api/              # API utilities
├── store/                # Redux store
└── types/                # TypeScript definitions
```

## Cài đặt và chạy dự án

1. Clone repository:

```bash
git clone <repository-url>
cd frontend
```

2. Cài đặt dependencies:

```bash
pnpm install
```

3. Tạo file môi trường:

```bash
cp .env.example .env.local
```

4. Chạy development server:

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

## Tính năng chính

- Kết nối ví (Metamask, WalletConnect)
- Xem và tìm kiếm NFT
- Mua bán NFT
- Đấu giá NFT
- Quản lý bộ sưu tập
- Trang cá nhân người dùng
- .....

## Quy tắc phát triển

- Sử dụng TypeScript cho type-safety
- Tuân thủ ESLint và Prettier config
- Viết unit test cho các component và logic quan trọng
- Sử dụng các hooks có sẵn trong `/hooks`
- Tách biệt logic nghiệp vụ vào các features riêng
- Sử dụng các components từ shadcn/ui

## Contributing

Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết về quy trình đóng góp code.