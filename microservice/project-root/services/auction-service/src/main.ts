import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { AuctionModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('auctionService');
  const rmqOptions = getRabbitMQConfig('auction-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(AuctionModule);
  await app.init();

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('auction Service is running');
}

bootstrap();
