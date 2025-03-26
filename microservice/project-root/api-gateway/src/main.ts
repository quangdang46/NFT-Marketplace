import { Logger } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  AllExceptionsFilter,
  ConfigService,
  getRabbitMQConfig,
} from '@project/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const logger = new Logger('GatewayService');
  const configService = new ConfigService();
  const rmqOptions = getRabbitMQConfig(configService, 'api-gateway');
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`); // Đảm bảo log queue

  const app = await NestFactory.create(GatewayModule);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.startAllMicroservices();
  await app.listen(8080);
  logger.log(`GraphQL Playground available at: ${await app.getUrl()}/graphql`);

  // Lắng nghe sự kiện disconnect và reconnect
  const client = app.get('RABBITMQ_SERVICE');
  client.on('disconnect', async () => {
    logger.error('Disconnected from RabbitMQ. Attempting to reconnect...');
    try {
      await app.close(); // Đóng microservice hiện tại
      app.connectMicroservice<MicroserviceOptions>(rmqOptions); // Kết nối lại
      await app.startAllMicroservices(); // Khởi động lại microservice
      await app.listen(8080); // Khởi động lại HTTP server
      logger.log('Reconnected and restarted microservice successfully');
    } catch (error) {
      logger.error('Failed to reconnect to RabbitMQ:', error);
    }
  });
}

bootstrap();
