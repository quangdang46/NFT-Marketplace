import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthService');
  const rmqOptions = getRabbitMQConfig('auth-service');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  // Sử dụng NestFactory.create thay vì createMicroservice
  const app = await NestFactory.create(AuthModule);

  // Kết nối microservice
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  // Khởi động microservice
  await app.startAllMicroservices();
  await app.init();

  logger.log('Auth Service is running');

}

bootstrap();
