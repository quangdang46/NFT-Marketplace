import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService, getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('UserService');
  const configService = new ConfigService();
  const rmqOptions = getRabbitMQConfig(configService, 'user-service');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  const app = await NestFactory.create(UserModule);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('User Service is running');

}

bootstrap();
