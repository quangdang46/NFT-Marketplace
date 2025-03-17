import { GatewayModule } from '@/gateway.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@project/shared';
async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  // Áp dụng AllExceptionsFilter toàn cục
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  await app.listen(8080);
}
bootstrap();
