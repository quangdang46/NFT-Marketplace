import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { OrderModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('OrderService');
  const rmqOptions = getRabbitMQConfig('order-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(OrderModule);
  
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);
  
  await app.startAllMicroservices();
  await app.init();
  logger.log('order Service is running');
}

bootstrap();
