import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { ChainModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('ChainService');
  const rmqOptions = getRabbitMQConfig('chain-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(ChainModule);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  await app.init();

  logger.log('chain Service is running');
}

bootstrap();
