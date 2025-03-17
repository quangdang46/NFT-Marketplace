import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Biến ConfigService thành global
      envFilePath: ".env", // Đọc từ file .env
    }),
  ],
  exports: [NestConfigModule], // Export để các module khác có thể dùng nếu cần
})
export class ConfigModule {}
