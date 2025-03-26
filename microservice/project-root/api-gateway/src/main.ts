import { VersioningType, Logger } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@project/shared';
import { Transport } from '@nestjs/microservices';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    logger.log('Creating Nest application...');
    const app = await NestFactory.create(GatewayModule);
    logger.log('Nest application created successfully');

    logger.log('Connecting microservice...');
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'api-gateway-queue',
        queueOptions: { durable: true },
        persistent: true,
        noAck: false, // Đảm bảo noAck là false
      },
    });

    logger.log('Configuring CORS...');
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    logger.log('Setting up global filters...');
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

    logger.log('Starting HTTP server and microservice...');
    await app.startAllMicroservices();
    await app.listen(8080);
    logger.log(`Application is running on: ${await app.getUrl()}`);
    logger.log(
      `GraphQL Playground available at: ${await app.getUrl()}/graphql`,
    );
  } catch (error) {
    logger.error('Failed to bootstrap application:', error.stack);
    process.exit(1);
  }
}

bootstrap();