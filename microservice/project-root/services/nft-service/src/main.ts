import { NestFactory } from '@nestjs/core'; // Import NestFactory để khởi tạo ứng dụng NestJS
import { MicroserviceOptions } from '@nestjs/microservices'; // Import MicroserviceOptions để cấu hình microservice
import { getRabbitMQConfig } from '@project/shared'; // Import ConfigService và getRabbitMQConfig từ shared module
import { Logger } from '@nestjs/common'; // Import Logger để ghi log
import { NFTModule } from './nft.module';

async function bootstrap() {
  const logger = new Logger('NFTService');
  const rmqOptions = getRabbitMQConfig('nft-service');

  logger.log(`Listening on queue: ${rmqOptions.options?.queue}`);

  const app = await NestFactory.create(NFTModule);
  await app.init();
  app.connectMicroservice<MicroserviceOptions>(rmqOptions);

  await app.startAllMicroservices();
  logger.log('NFT Service is running');
}

bootstrap();
