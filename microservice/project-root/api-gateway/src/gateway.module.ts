import { MiddlewareConsumer, Module, Logger } from '@nestjs/common';
import { GatewayService } from './v1/gateway.service';
import {
  getRedisConfig,
  RateLimitMiddleware,
  SharedConfigModule,
  ConfigService,
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  getJwtConfig,
  JwtGuard,
  JwtService,
} from '@project/shared';
import { RedisModule } from '@nestjs-modules/ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtModule} from '@nestjs/jwt';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthResolver } from '@/v1/auth/auth.resolver';
const IMPORTS = [
  SharedConfigModule,
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => getJwtConfig(configService),
    inject: [ConfigService],
  }),
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

  GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [SharedConfigModule],
    useFactory: (configService: ConfigService) => ({
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req,res }) => ({ req,res }),
      path: '/graphql',
      useGlobalPrefix: false,
    }),
    inject: [ConfigService],
  }),
];
const CONTROLLERS = [];
const PROVIDERS = [
  GatewayService,
  JwtGuard,
  JwtService,
  // bat buoc
  // grapql
  AuthResolver,
  // grapql

  {
    provide: ServiceClient,
    useFactory: (options: any, discovery: ServiceDiscovery) => {
      return new ServiceClient(options, discovery, []); // initialServices là mảng rỗng
    },
    inject: ['RABBITMQ_OPTIONS', ServiceDiscovery],
  },
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, 'api-gateway'),
    inject: [ConfigService],
  },
  // bat buoc
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const serviceDiscovery = new ServiceDiscovery(
        configService,
        'api-gateway',
      );
      await serviceDiscovery.registerService(
        'api-gateway',
        { queue: 'api-gateway-queue' },
        ['gateway', 'rabbitmq'],
      );
      const logger = new Logger('GatewayModule');
      logger.log('API Gateway registered with Consul');
      return serviceDiscovery;
    },
    inject: [ConfigService],
  },
];
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
