import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Hoặc chỉ định cụ thể: ['http://localhost:3000']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Nếu dùng cookie hoặc token
  });
  app.setGlobalPrefix('api'); // Định nghĩa tiền tố chung

  app.enableVersioning({
    type: VersioningType.URI, // Dùng URL versioning
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
