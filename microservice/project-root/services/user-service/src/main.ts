import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { getRabbitMQConfig,ConfigService } from '@project/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.RMQ,
      options: getRabbitMQConfig(new ConfigService(), 'USER'),
    },
  );

  await app.listen();
}
bootstrap();
