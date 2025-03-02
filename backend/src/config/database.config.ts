// import { registerAs } from '@nestjs/config';

// export default registerAs('database', () => ({
//   postgres: {
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT || '5432', 10),
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   },
//   mongo: {
//     uri: process.env.MONGODB_URI,
//   },
//   redis: {
//     url: process.env.REDIS_URL || 'redis://localhost:6379',
//   },
// }));

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
