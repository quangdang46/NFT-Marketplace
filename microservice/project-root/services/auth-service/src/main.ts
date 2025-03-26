import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { getRabbitMQConfig, ConfigService } from '@project/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthService');
  const configService = new ConfigService();
  const rmqOptions = getRabbitMQConfig(configService, 'auth-service');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  // Sử dụng NestFactory.create thay vì createMicroservice
  const app = await NestFactory.create(AuthModule);

  // Kết nối microservice
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  // Khởi động microservice
  await app.startAllMicroservices();
  logger.log('Auth Service is running');

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
