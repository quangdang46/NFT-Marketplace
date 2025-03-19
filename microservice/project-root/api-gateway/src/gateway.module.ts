import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './v1/auth/auth.controller';
import { GatewayService } from './v1/gateway.service';
import {
  getRedisConfig,
  RateLimitMiddleware,
  SharedConfigModule,
  ConfigService,
  getJwtConfig,
} from '@project/shared';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ServiceDiscovery } from '@/config/service-discovery.config';

const IMPORTS = [
  SharedConfigModule,
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => getRedisConfig(configService),
    inject: [ConfigService],
  }),
];
const CONTROLLERS = [AuthController];
const PROVIDERS = [GatewayService, ServiceDiscovery];
const EXPORTS = [];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
  exports: EXPORTS,
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('/*path');
  }
}
