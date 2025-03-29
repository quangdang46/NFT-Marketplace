import {
  MiddlewareConsumer,
  Module,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  getRedisConfig,
  RateLimitMiddleware,
  ServiceDiscovery,
  getRabbitMQConfig,
  getJwtConfig,
  JwtGuard,
  JwtService,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
} from '@project/shared';
import { RedisModule } from '@nestjs-modules/ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthResolver } from './v1/auth/auth.resolver';
import { GatewayController } from './v1/gateway.controller';
import { ClientsModule } from '@nestjs/microservices';
import { GatewayService } from '@/v1/gateway.service';
import { NftResolver } from '@/v1/nft/nft.resolver';
import { CollectionResolver } from '@/v1/collection/collection.resolver';
import { UserResolver } from '@/v1/user/user.resolver';
import { WalletResolver } from '@/v1/wallet/wallet.resolver';
import { AuctionResolver } from '@/v1/auction/auction.resolver';
import { OrderResolver } from '@/v1/order/order.resolver';
import { FileResolver } from '@/v1/file/file.resolver';

// Định nghĩa kiểu EventsMap và Status
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'api-gateway';

const IMPORTS = [
  JwtModule.registerAsync({
    useFactory: () => getJwtConfig(),
    inject: [],
  }),
  RedisModule.forRootAsync({
    useFactory: () => ({
      ...getRedisConfig(),
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
    inject: [],
  }),
  GraphQLModule.forRootAsync<ApolloDriverConfig>({
    driver: ApolloDriver,
    imports: [],
    useFactory: () => ({
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
      path: '/graphql',
      useGlobalPrefix: false,
    }),
    inject: [],
  }),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME),
      inject: [],
    },
  ]),
];

const CONTROLLERS = [GatewayController];

const PROVIDERS = [
  JwtGuard,
  JwtService,
  GatewayService,
  AuthResolver,
  // CollectionResolver,
  // NftResolver,
  UserResolver,
  // WalletResolver,
  // AuctionResolver,
  // OrderResolver,
  FileResolver,
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: () => getRabbitMQConfig(SERVICE_NAME),
    inject: [],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async () => {
      const serviceDiscovery = new ServiceDiscovery(SERVICE_NAME);
      await serviceDiscovery.registerService(
        SERVICE_NAME,
        { queue: `${SERVICE_NAME}-queue` },
        ['gateway', 'rabbitmq'],
      );
      const logger = new Logger('GatewayModule');
      logger.log('API Gateway registered with Consul');
      return serviceDiscovery;
    },
    inject: [],
  },
  {
    provide: ServiceClient,
    useFactory: (discovery: ServiceDiscovery) => {
      return new ServiceClient(discovery, [SERVICE_NAME]);
    },
    inject: [ServiceDiscovery],
  },
  {
    provide: RabbitMQHealthService,
    useFactory: (
      serviceDiscovery: ServiceDiscovery,
      rabbitMQClient: ClientProxy<EventsMap, Status>,
    ) => {
      return new RabbitMQHealthService(
        SERVICE_NAME,
        rabbitMQClient,
        serviceDiscovery,
        `${SERVICE_NAME}-queue`,
        ['gateway', 'rabbitmq'],
      );
    },
    inject: [ServiceDiscovery, 'RABBITMQ_SERVICE'],
  },
];

const EXPORTS = [];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
  exports: EXPORTS,
})
export class GatewayModule implements OnModuleInit {
  private readonly logger = new Logger(GatewayModule.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly rabbitMQHealthService: RabbitMQHealthService,
  ) {
    this.logger.log('Gateway Module initialized');
    this.checkRedisConnection();
  }

  private async checkRedisConnection() {
    try {
      await this.redis.ping();
      this.logger.log('Successfully connected to Redis');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error.message);
    }
  }

  async onModuleInit() {
    console.log('Before RabbitMQ initialization...');
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      return;
    }

    // Bỏ gọi setupReconnectHandler
    await new Promise((resolve) => setTimeout(resolve, 10000));
    this.logger.log('Starting health check for GatewayModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RateLimitMiddleware).forRoutes('/*path');
  // }
}
