import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { WalletModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('WalletService');
  const rmqOptions = getRabbitMQConfig('wallet-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(WalletModule);
  
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);
  
  await app.startAllMicroservices();
  await app.init();
  logger.log('wallet Service is running');
}

bootstrap();
