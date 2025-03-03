import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Định nghĩa tiền tố chung

  app.enableVersioning({
    type: VersioningType.URI, // Dùng URL versioning
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
