import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { FileModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('fileService');
  const rmqOptions = getRabbitMQConfig('file-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(FileModule);
  
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  await app.init();

  logger.log('file Service is running');
}

bootstrap();
