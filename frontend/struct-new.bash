frontend/
├── public/                  
├── src/
│   ├── app/                
│   │   ├── (public)/
│   │   ├── wallet/
│   │   ├── admin/
│   ├── components/          
│   ├── features/            
│   │   ├── nft/             
│   │   ├── wallet/          
│   │   ├── auth/ 
│   ├── lib/               
│   │   ├── blockchain/      # Tách thành adapters (Solana.ts, Ethereum.ts)
│   ├── hooks/             
│   ├── store/             
│   ├── styles/             # Thêm cấu trúc cho themes
│   │   ├── themes/          # lightTheme.ts, darkTheme.ts
│   │   ├── globals.css
│   ├── locales/             # Đa ngôn ngữ (i18n)
│   │   ├── en.json          # Tiếng Anh
│   │   ├── vi.json          # Tiếng Việt
│   ├── types/             
│   ├── middleware.ts
├── next.config.js
├── .env.local
├── tsconfig.json