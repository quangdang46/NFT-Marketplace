import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './v1/auth/auth.controller';
import { GatewayService } from './v1/gateway.service';
import { ServiceDiscovery } from './config/service-discovery.config';
import {
  ConfigModule,
  getRedisConfig,
  JwtGuard,
  RateLimitMiddleware,
} from '@project/shared';
import { getJwtConfig } from '@project/shared';
import { RedisModule } from '@nestjs-modules/ioredis';

const IMPORTS = [
  ConfigModule, // Dùng ConfigModule từ shared
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => getJwtConfig(configService),
    inject: [ConfigService],
  }),
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => getRedisConfig(configService),
    inject: [ConfigService],
  }),
];
const CONTROLLERS = [AuthController];
const PROVIDERS = [GatewayService, ServiceDiscovery, JwtGuard];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('/*path');
  }
}
