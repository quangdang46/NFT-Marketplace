frontend/
├── public/                  
├── src/
│   ├── app/                
│   │   ├── (public)/
│   │       ├── [chain]/
│   │       ├── page.tsx
│   │   ├── wallet/
│   │   ├── admin/
│   │   ├── page.tsx
│   ├── components/          
│   ├── features/
│   │   ├── home/
│   │       ├── components
│   │           ├── TabChains.tsx
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
│   ├── locales/            
│   │   ├── en.json         
│   │   ├── vi.json          
│   ├── types/             
│   ├── middleware.ts
├── next.config.js
├── .env.local
├── tsconfig.json