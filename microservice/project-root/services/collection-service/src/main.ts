import { NestFactory } from '@nestjs/core'; // Import NestFactory để khởi tạo ứng dụng NestJS
import { MicroserviceOptions } from '@nestjs/microservices'; // Import MicroserviceOptions để cấu hình microservice
import { getRabbitMQConfig } from '@project/shared'; // Import ConfigService và getRabbitMQConfig từ shared module
import { Logger } from '@nestjs/common'; // Import Logger để ghi log
import { CollectionModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('CollectionService'); // Tạo logger với tên collectionService
  const rmqOptions = getRabbitMQConfig('collection-service'); // Lấy cấu hình RabbitMQ cho collection-service

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(CollectionModule);
  await app.init();

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  // Khởi động tất cả microservices
  await app.startAllMicroservices();
  logger.log('collection Service is running'); // Ghi log khi service khởi động thành công
}

bootstrap();
