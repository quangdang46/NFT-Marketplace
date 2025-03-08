
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true, // Cho phép sử dụng ConfigService ở mọi nơi
      envFilePath: '.env', // Đường dẫn đến file .env
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
