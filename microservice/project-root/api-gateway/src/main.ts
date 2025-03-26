import { Logger } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  AllExceptionsFilter,
  ConfigService,
  getRabbitMQConfig,
} from '@project/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

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

}

bootstrap();
