import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { TestModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('TestService');
  const rmqOptions = getRabbitMQConfig('test-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(TestModule);
  await app.init();

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('Test Service is running');
}

bootstrap();
