import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService, getRabbitMQConfig } from '@project/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.RMQ,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      options: getRabbitMQConfig(new ConfigService(), 'USER'),
    },
  );

  await app.listen();
}
bootstrap();
