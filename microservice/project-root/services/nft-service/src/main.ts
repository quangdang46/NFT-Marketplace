// main.ts
import { NestFactory } from '@nestjs/core'; // Import NestFactory để khởi tạo ứng dụng NestJS
import { MicroserviceOptions } from '@nestjs/microservices'; // Import MicroserviceOptions để cấu hình microservice
import { ConfigService, getRabbitMQConfig } from '@project/shared'; // Import ConfigService và getRabbitMQConfig từ shared module
import { Logger } from '@nestjs/common'; // Import Logger để ghi log
import { NFTModule } from '@/app.module';

async function bootstrap() {
  const logger = new Logger('NFTService'); 
  const configService = new ConfigService(); 
  const rmqOptions = getRabbitMQConfig(configService, 'nft-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(NFTModule);

  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('NFT Service is running'); 
}

bootstrap();
