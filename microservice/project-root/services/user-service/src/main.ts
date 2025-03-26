import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './user.module';
import { ConfigService, getRabbitMQConfig } from '@project/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('UserService');
  const configService = new ConfigService();
  const rmqOptions = getRabbitMQConfig(configService, 'user-service');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  const app = await NestFactory.create(UserModule);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('User Service is running');

  // Lắng nghe sự kiện disconnect và reconnect
  const client = app.get('RABBITMQ_SERVICE');
  client.on('disconnect', async () => {
    logger.error('Disconnected from RabbitMQ. Attempting to reconnect...');
    try {
      await app.close(); // Đóng microservice hiện tại
      app.connectMicroservice<MicroserviceOptions>(rmqOptions); // Kết nối lại
      await app.startAllMicroservices(); // Khởi động lại microservice
      logger.log('Reconnected and restarted microservice successfully');
    } catch (error) {
      logger.error('Failed to reconnect to RabbitMQ:', error);
    }
  });
}

bootstrap();
