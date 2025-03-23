import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { getRabbitMQConfig, ConfigService } from '@project/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthService');
  const configService = new ConfigService();
  const rmqOptions = getRabbitMQConfig(configService, 'auth-service');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    rmqOptions,
  );
  await app.listen();
  logger.log('Auth Service is running');
}

bootstrap();
