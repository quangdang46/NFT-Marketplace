import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { getRabbitMQConfig, ConfigService } from '@project/shared';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    getRabbitMQConfig(configService, 'auth-service'),
  );

  await app.listen();
  console.log('Auth Service is running');
}

bootstrap();
