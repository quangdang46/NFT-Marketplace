// main.ts
import { NestFactory } from '@nestjs/core'; // Import NestFactory để khởi tạo ứng dụng NestJS
import { MicroserviceOptions } from '@nestjs/microservices'; // Import MicroserviceOptions để cấu hình microservice
import { ConfigService, getRabbitMQConfig } from '@project/shared'; // Import ConfigService và getRabbitMQConfig từ shared module
import { Logger } from '@nestjs/common'; // Import Logger để ghi log
import { TestModule } from '@/app.module';

// Hàm bootstrap để khởi động ứng dụng
async function bootstrap() {
  const logger = new Logger('TestService'); // Tạo logger với tên TestService
  const configService = new ConfigService(); // Khởi tạo ConfigService để lấy cấu hình
  const rmqOptions = getRabbitMQConfig(configService, 'test-service'); // Lấy cấu hình RabbitMQ cho test-service

  // Ghi log queue mà test-service sẽ lắng nghe
  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  // Khởi tạo ứng dụng NestJS với TestModule
  const app = await NestFactory.create(TestModule);

  // Kết nối microservice với RabbitMQ sử dụng cấu hình rmqOptions
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  // Khởi động tất cả microservices
  await app.startAllMicroservices();
  logger.log('Test Service is running'); // Ghi log khi service khởi động thành công
}

// Gọi hàm bootstrap để chạy ứng dụng
bootstrap();
