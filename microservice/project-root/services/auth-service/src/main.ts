import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { getRabbitMQConfig,ConfigService } from '@project/shared';

async function bootstrap() {
  const configService = new ConfigService(); 
  const rmqOptions = getRabbitMQConfig(configService, 'AUTH');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: rmqOptions,
    },
  );

  await app.listen();
}

bootstrap();
