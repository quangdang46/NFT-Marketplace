import { MiddlewareConsumer, Module, Logger } from '@nestjs/common';
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
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

const IMPORTS = [
  SharedConfigModule,
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      ...getRedisConfig(configService),
      onClientReady: (client) => {
        const logger = new Logger('RedisModule');
        logger.log('Redis client ready');
        client.on('error', (err) => logger.error('Redis Client Error:', err));
        client.on('connect', () => logger.log('Redis Client Connected'));
        client.on('reconnecting', () =>
          logger.warn('Redis Client Reconnecting'),
        );
        client.on('end', () => logger.warn('Redis Client Connection Ended'));
      },
    }),
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
  private readonly logger = new Logger(GatewayModule.name);

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.logger.log('Gateway Module initialized');
    this.checkRedisConnection();
  }

  private async checkRedisConnection() {
    try {
      await this.redis.ping();
      this.logger.log('Successfully connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('/*path');
  }
}
