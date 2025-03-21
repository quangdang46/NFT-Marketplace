import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService, getRabbitMQConfig } from '@project/shared';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    getRabbitMQConfig(configService, 'user-service'),
  );
  await app.listen();
  console.log('User Service is running');
}
bootstrap();
