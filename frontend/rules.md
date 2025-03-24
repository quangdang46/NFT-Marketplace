# Frontend Development Rules

## 1. Cấu trúc thư mục và đặt tên file

### Cấu trúc thư mục

- `/src/app`: Chứa các route pages và layouts,các page không được dùng use client để sử dụng metadata ,nếu có cấu trúc phức tạp sẽ import từ /features
- `/src/components`: Chứa các shared components
- `/src/features`: Chứa các module theo tính năng
  ..../src/features/home (index.tsx,.....)`

  - `/src/features`/shared`: Components dùng chung giữa các features

- `/src/hooks`: Chứa các custom hooks
- `/src/lib`: Chứa các utilities và constants
- `/src/store`: Chứa các global states
- `/src/types`: Chứa các type definitions

### Quy tắc đặt tên

- Components: PascalCase (ví dụ: `NavLink.tsx`, `WalletButton.tsx`)
- Hooks: camelCase, bắt đầu bằng "use" (ví dụ: `useNftFilter.ts`)
- Constants: UPPER_SNAKE_CASE cho constants, PascalCase cho types/interfaces
- Utilities: camelCase

## 2. Routing và Dynamic Routes

### Cấu trúc Route

- Sử dụng Next.js App Router với cấu trúc folder-based routing
- Route groups nên được đặt trong ngoặc đơn (ví dụ: `(public)`)
- Các dynamic segments nên được đặt trong dấu ngoặc vuông (ví dụ: `[chain]`)

### Error và Loading States

- Mỗi route phức tạp nên có:
  - `loading.tsx` cho loading states
  - `error.tsx` cho error handling
  - `not-found.tsx` cho 404 errors

## 3. Components và Hooks

### Components

- Ưu tiên sử dụng Function Components với TypeScript
- Props interface phải được định nghĩa rõ ràng
- Tách biệt UI components (dumb) và container components (smart)
- Sử dụng các UI components từ thư viện shadcn/ui một cách nhất quán

### Custom Hooks

- Tách logic phức tạp vào custom hooks
- Hooks nên focus vào một chức năng cụ thể
- Đặt tên rõ ràng, thể hiện chức năng của hook

## 4. State Management

### Local State

- Sử dụng `useState` cho component-level state
- Sử dụng `useReducer` cho complex state logic

### Global State

- Sử dụng Redux Toolkit cho global state management
- Tổ chức store theo feature-based structure:
  - `/src/store`: Chứa các Redux slices và store configuration
    - Mỗi slice file (vd: authStore.ts, nftStore.ts)
    - store.ts: Store configuration và root reducer
    - hooks.ts: Custom hooks (useAppDispatch, useAppSelector)
- `/src/middleware`: Tách riêng middleware ra khỏi store
  - Chứa các custom middleware của ứng dụng
  - Mỗi middleware được tách thành file riêng
  - Có thể chứa các middleware factory và handlers
- Mỗi feature slice cần có:
  - Initial state với TypeScript interface
  - Reducers cho sync actions
  - Thunks cho async operations
  - Selectors để truy xuất state
- Sử dụng createSlice cho type-safe reducers và actions
- Implement Redux DevTools cho development
- Sử dụng Redux Thunk cho async actions
- Tránh mutation trực tiếp state (dùng immer trong RTK)

## 5. Error Handling và Loading States

### Error Handling

- Sử dụng error boundaries ở cấp route
- Xử lý errors một cách graceful với meaningful error messages
- Log errors phù hợp cho debugging

### Loading States

- Implement skeleton loading cho UI components
- Sử dụng Suspense cho code-splitting
- Hiển thị loading indicators phù hợp với UX

## 6. Code Style

### TypeScript

- Strict mode enabled
- Định nghĩa types/interfaces cho tất cả props và state
- Tránh sử dụng `any`

### Formatting

- Sử dụng ESLint và Prettier
- 2 spaces cho indentation
- Semicolons required
- Single quotes cho strings

## 7. Performance

### Optimization

- Sử dụng `useMemo` và `useCallback` cho expensive operations
- Implement code-splitting với dynamic imports
- Optimize images với Next.js Image component

### Bundle Size

- Minimize bundle size
- Sử dụng tree-shaking
- Lazy load components khi cần thiết
