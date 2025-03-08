import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    // logger: ['error', 'warn']
  });
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('NFT Marketplace API') // Tiêu đề
    .setDescription('API docs cho NFT Marketplace') // Mô tả API
    .setVersion('1.0') // Phiên bản API
    .addBearerAuth() // Thêm xác thực Bearer Token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Đường dẫn truy cập docs

  app.enableCors({
    // origin: 'http://localhost:3000',
    origin: '*',
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
