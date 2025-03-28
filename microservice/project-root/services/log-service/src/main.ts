import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { LogModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('LogService');
  const rmqOptions = getRabbitMQConfig('log-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(LogModule);
  await app.init();

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('log Service is running');
}

bootstrap();
