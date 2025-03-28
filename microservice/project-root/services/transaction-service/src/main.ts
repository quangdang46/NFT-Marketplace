import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { TransactionModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('TransactionService');
  const rmqOptions = getRabbitMQConfig('transaction-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(TransactionModule);
  
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  await app.init();
  logger.log('transaction Service is running');
}

bootstrap();
