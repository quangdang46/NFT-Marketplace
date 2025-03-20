frontend/
├── public/                  # Static files served directly
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # Public routes
│   │   │   ├── [chain]/     # Dynamic chain routes
│   │   │   │   └── page.tsx # Chain specific page
│   │   │   └── page.tsx     # Public home page
│   │   ├── wallet/          # Wallet related pages
│   │   ├── admin/           # Admin dashboard pages
│   │   └── page.tsx         # Root page
│   ├── components/          # Shared UI components
│   │   ├── ui/              # Base UI components (buttons, inputs)
│   │   ├── Header.tsx       # Main navigation header
│   │   ├── SearchBar.tsx    # Global search component
│   │   └── WalletButton.tsx # Wallet connection button
│   ├── features/            # Feature-specific modules
│   │   ├── home/            # Home page features
│   │   │   └── components/  # Home page components
│   │   │       └── TabChains.tsx
│   │   ├── nft/             # NFT related features
│   │   ├── wallet/          # Wallet management features
│   │   ├── auth/            # Authentication features
│   │   └── shared/          # Shared feature components
│   │       ├── CarouselNFT/ # NFT carousel component
│   │       ├── NFTCollections/ # NFT collections views
│   │       └── shop/        # Marketplace components
│   ├── lib/                 # Core utilities and services
│   │   ├── blockchain/      # Blockchain integrations
│   │   │   ├── adapters/    # Chain-specific adapters
│   │   │   │   ├── Solana.ts
│   │   │   │   └── Ethereum.ts
│   │   │   └── wallet.ts    # Wallet connection logic
│   │   └── api/             # API utilities
│   ├── hooks/               # Custom React hooks
│   ├── store/               # State management
│   │   ├── authStore.ts     # Authentication state
│   │   └── useNftStore.ts   # NFT related state
│   ├── styles/              # Global styles
│   │   ├── themes/          # Theme configurations
│   │   │   ├── lightTheme.ts
│   │   │   └── darkTheme.ts
│   │   └── globals.css      # Global CSS
│   ├── locales/             # i18n translations
│   │   ├── en.json          # English translations
│   │   └── vi.json          # Vietnamese translations
│   ├── types/               # TypeScript type definitions
│   └── middleware.ts        # Next.js middleware
├── next.config.js           # Next.js configuration
├── .env.local               # Environment variables
└── tsconfig.json           # TypeScript configuration