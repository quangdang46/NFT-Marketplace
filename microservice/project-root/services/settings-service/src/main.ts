import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import {  getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';
import { SettingsModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('settingsService');
  const rmqOptions = getRabbitMQConfig('settings-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(SettingsModule);
  
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);
  
  await app.startAllMicroservices();
  await app.init();
  logger.log('settings Service is running');
}

bootstrap();
