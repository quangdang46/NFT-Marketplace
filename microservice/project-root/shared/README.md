# Shared Module Structure

Cấu trúc thư mục shared module được tổ chức theo hướng module-based và domain-driven:

```
shared/
├── config/              # Cấu hình chung
├── constants/           # Các hằng số
│   ├── auth/           # Auth related constants
│   └── common/         # Common constants
├── decorators/         # Custom decorators
├── dto/                # Data Transfer Objects
│   ├── auth/
│   └── user/
├── entities/          # Shared entities/models
├── events/            # Event definitions
├── exceptions/        # Custom exceptions
├── guards/            # Auth guards
├── helpers/           # Utility functions
├── interceptors/      # Custom interceptors
├── interfaces/        # Type definitions
│   ├── auth/
│   └── user/
├── middlewares/       # Custom middlewares
├── pipes/             # Custom validation pipes
├── services/          # Shared services
└── utils/             # Common utilities
```

## Mô tả các thư mục

- **config**: Chứa các cấu hình chung cho toàn bộ microservices
- **constants**: Các hằng số được tổ chức theo domain
- **decorators**: Custom decorators cho các chức năng chung
- **dto**: Data Transfer Objects được tổ chức theo domain
- **entities**: Các model/entity dùng chung
- **events**: Định nghĩa các event trong hệ thống
- **exceptions**: Custom exceptions và exception filters
- **guards**: Authentication/Authorization guards
- **helpers**: Các utility function tái sử dụng
- **interceptors**: Custom interceptors
- **interfaces**: Type definitions được tổ chức theo domain
- **middlewares**: Custom middlewares
- **pipes**: Custom validation pipes
- **services**: Các shared services dùng chung
- **utils**: Common utilities và helper functions
