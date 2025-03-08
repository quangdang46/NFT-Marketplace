backend/
├── src/
│   ├── auth/                
│   │   ├── dto/            
│   │   │   ├── login.dto.ts 
│   │   ├── guards/          
│   │   │   ├── jwt/        
│   │   │   │   ├── jwt.guard.ts 
│   │   │   ├── roles/       
│   │   │   │   ├── roles.guard.ts 
│   │   ├── strategies/      
│   │   │   ├── jwt/         
│   │   │   │   ├── jwt.ts   
│   │   ├── auth.module.ts   
│   │   ├── auth.service.ts  
│   │   ├── auth.controller.ts 
│   ├── nft/                 # Module quản lý NFT
│   │   ├── dto/             # DTO cho NFT
│   │   ├── nft.module.ts    # NFT module
│   │   ├── nft.service.ts   # NFT service
│   │   ├── nft.controller.ts # NFT controller
│   ├── user/                # Module quản lý người dùng
│   │   ├── dto/             # DTO cho user
│   │   ├── user.module.ts   # User module
│   │   ├── user.service.ts  # User service
│   │   ├── user.controller.ts # User controller
│   ├── blockchain/          # Module tương tác với blockchain
│   │   ├── solana/          # Logic tương tác với Solana
│   │   ├── ethereum/        # Logic tương tác với Ethereum
│   │   ├── blockchain.module.ts # Blockchain module
│   │   ├── blockchain.service.ts # Blockchain service
│   ├── common/              # Thư mục chứa các utility, guards, interceptors
│   │   ├── guards/          # Global guards
│   │   ├── interceptors/    # Global interceptors
│   │   ├── filters/         # Exception filters
│   │   ├── decorators/      # Custom decorators
│   ├── config/              # Thư mục chứa cấu hình ứng dụng
│   │   ├── app.config.ts    # Cấu hình ứng dụng
│   │   ├── database.config.ts # Cấu hình database
│   │   ├── blockchain.config.ts # Cấu hình blockchain
│   ├── database/            # ✅ Tách thư mục riêng cho database
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── nft.entity.ts
│   │   ├── mongodb/
│   │   │   ├── schemas/
│   │   │   │   ├── transaction-log.schema.ts
│   │   │   ├── mongodb.module.ts
│   │   ├── redis/
│   │   │   ├── redis.module.ts
│   │   │   ├── redis.service.ts
│   │   ├── migrations/      # Chứa file migration
│   │   ├── seeds/           # Chứa file seed data
│   │   ├── prisma.service.ts # (Nếu dùng Prisma)
│   │   ├── database.module.ts 
│   ├── upload/              # ✅ Thêm thư mục xử lý upload file
│   ├── utils/               # ✅ Chứa helper functions (format date, hash password, v.v.)
│   ├── app.module.ts        # Root module
│   ├── main.ts              # Entry point của ứng dụng
├── test/                    # Thư mục chứa các file test
│   ├── e2e/                 # End-to-end tests
│   ├── unit/                # Unit tests
├── .env                     # Biến môi trường
├── nest-cli.json            # Cấu hình NestJS CLI
├── tsconfig.json            # Cấu hình TypeScript



frontend/
├── public/
├── src/
│   ├── app/                 
│   │   ├── (public)/
│   │   ├── wallet/
│   │   │   ├── [chain]
│   │   │   │   ├── [address]
│   │   │   │   │   ├── nfts/
│   │   │   │   │   ├── activities/
│   │   │   │   │   ├── page.tsx
│   │   │   ├── nft/  
│   │   │   │   ├── page.tsx  
│   │   ├── admin /        
│   │   │   │   ├── layout.tsx   
│   │   │   │   ├── page.tsx    
│   │   ├── layout.tsx      
│   │   ├── page.tsx         
│   ├── components/          # Thư mục chứa các component tái sử dụng
│   │   ├── ui/              # Các component UI cơ bản (button, card, modal, v.v.)
│   │   ├── nft/             # Các component liên quan đến NFT (NFT card, NFT detail, v.v.)
│   │   ├── wallet/          # Các component liên quan đến ví điện tử (connect wallet, v.v.)
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Hook kiểm tra xác thực
│   │   ├── useRole.ts       # Hook kiểm tra phân quyền người dùng
│   ├── middleware/          # Middleware Next.js cho bảo vệ route
│   │   ├── authMiddleware.ts # Middleware kiểm tra xác thực
│   │   ├── adminMiddleware.ts # Middleware chỉ cho phép admin truy cập
│   ├── lib/                 # Thư mục chứa các utility functions, helpers
│   │   ├── api/             # Các hàm gọi API (GraphQL, REST)
│   │   ├── blockchain/      # Các hàm tương tác với blockchain (Solana, Ethereum)
│   │   ├── constants/       # Các hằng số (địa chỉ contract, API endpoints, v.v.)
│   ├── store/               # Thư mục chứa state management (Zustand)
│   │   ├── authStore.ts     # Store để quản lý trạng thái xác thực
│   ├── styles/              
│   ├── types/               
│   │   ├── user.ts          # Type cho thông tin người dùng
│   │   ├── auth.ts          # Type cho token & quyền hạn
│   │   ├── role.ts          # Enum các quyền (admin, user, guest)
├── middleware.ts            # Global middleware Next.js
├── .env.local               # Biến môi trường local
├── next.config.js           # Cấu hình Next.js
├── tsconfig.json            # Cấu hình TypeScript