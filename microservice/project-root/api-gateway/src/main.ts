import { VersioningType } from '@nestjs/common';
import { GatewayModule } from './gateway.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@project/shared';
async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Nếu dùng cookie hoặc token
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`GraphQL should be available at: ${await app.getUrl()}/graphql`);
}
bootstrap();
