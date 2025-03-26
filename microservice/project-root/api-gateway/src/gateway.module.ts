import {
  MiddlewareConsumer,
  Module,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  getRedisConfig,
  RateLimitMiddleware,
  SharedConfigModule,
  ConfigService,
  ServiceDiscovery,
  getRabbitMQConfig,
  getJwtConfig,
  JwtGuard,
  JwtService,
  ServiceClient,
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
import { ClientsModule, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { GatewayService } from '@/v1/gateway.service';

const SERVICE_NAME = 'api-gateway';

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
      context: ({ req, res }) => ({ req, res }),
      path: '/graphql',
      useGlobalPrefix: false,
    }),
    inject: [ConfigService],
  }),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: (configService: ConfigService) =>
        getRabbitMQConfig(configService, SERVICE_NAME),
      inject: [ConfigService],
    },
  ]),
];

const CONTROLLERS = [GatewayController];

const PROVIDERS = [
  JwtGuard,
  JwtService,
  GatewayService,
  AuthResolver,
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, SERVICE_NAME),
    inject: [ConfigService],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const serviceDiscovery = new ServiceDiscovery(
        configService,
        SERVICE_NAME,
      );
      await serviceDiscovery.registerService(
        SERVICE_NAME,
        { queue: 'api-gateway-queue' },
        ['gateway', 'rabbitmq'],
      );
      const logger = new Logger('GatewayModule');
      logger.log('API Gateway registered with Consul');
      return serviceDiscovery;
    },
    inject: [ConfigService],
  },
  {
    provide: ServiceClient,
    useFactory: (configService: ConfigService, discovery: ServiceDiscovery) => {
      return new ServiceClient(configService, discovery, [SERVICE_NAME]);
    },
    inject: [ConfigService, ServiceDiscovery],
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
    private readonly serviceDiscovery: ServiceDiscovery,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy,
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
    this.logger.log(
      'GatewayModule initialized, waiting for RabbitMQ client to be ready...',
    );
    let clientReady = false;
    const maxAttempts = 40; // Tăng từ 30 lên 40
    const retryDelay = 250; // Giảm từ 500ms xuống 250ms

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.rabbitMQClient.connect();
        clientReady = true;
        this.logger.log('RabbitMQ client is ready');
        break;
      } catch (error) {
        this.logger.warn(
          `Client not ready, retrying (${attempt + 1}/${maxAttempts})...`,
          error.message || error.code || error.stack || 'Unknown error',
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!clientReady) {
      this.logger.error(
        `Failed to initialize RabbitMQ client after ${maxAttempts} attempts`,
      );
      return;
    }

    // Lắng nghe sự kiện disconnect và reconnect
    (this.rabbitMQClient as any).on('disconnect', async () => {
      this.logger.error(
        'RabbitMQ client disconnected. Attempting to reconnect...',
      );
      let reconnected = false;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          await this.rabbitMQClient.connect();
          reconnected = true;
          this.logger.log('RabbitMQ client reconnected successfully');

          // Đăng ký lại service với Consul sau khi reconnect
          await this.serviceDiscovery.registerService(
            SERVICE_NAME,
            { queue: 'api-gateway-queue' },
            ['gateway', 'rabbitmq'],
          );
          this.logger.log('Re-registered service with Consul after reconnect');

          // Đảm bảo consumer được đăng ký lại
          this.rabbitMQClient.emit('restart', {});
          this.logger.log('Restarted microservice to re-register consumers');
          break;
        } catch (error) {
          this.logger.warn(
            `Reconnect failed, retrying (${attempt + 1}/${maxAttempts})...`,
            error.message || error.code || error.stack || 'Unknown error',
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }

      if (!reconnected) {
        this.logger.error(
          `Failed to reconnect RabbitMQ client after ${maxAttempts} attempts`,
        );
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for GatewayModule');
    const attemptHealthCheck = async (maxRetries = 3, retryDelay = 5000) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          try {
            await this.rabbitMQClient.connect();
          } catch (error) {
            this.logger.warn(
              'RabbitMQ client not connected before health check',
              error.message || error.code || error.stack || 'Unknown error',
            );
            throw new Error('RabbitMQ client not connected');
          }

          await this.serviceDiscovery.passHealthCheck();
          this.logger.log('Initial health check passed');
          return;
        } catch (error) {
          this.logger.error(
            `Initial health check failed (attempt ${i + 1}/${maxRetries}): ${error.message}`,
          );
          if (i < maxRetries - 1) {
            this.logger.log(`Retrying health check after ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }
      this.logger.error(
        'Failed to pass initial health check after all retries',
      );
    };

    await attemptHealthCheck();

    setInterval(async () => {
      try {
        try {
          await this.rabbitMQClient.connect();
        } catch (error) {
          this.logger.warn(
            'RabbitMQ client not connected before periodic health check',
            error.message || error.code || error.stack || 'Unknown error',
          );
          throw new Error('RabbitMQ client not connected');
        }

        await this.serviceDiscovery.passHealthCheck();
        this.logger.log('Periodic health check passed');
      } catch (error) {
        this.logger.error(`Periodic health check failed: ${error.message}`);
        let reconnected = false;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            await this.rabbitMQClient.connect();
            reconnected = true;
            this.logger.log(
              'Reconnected to RabbitMQ after health check failure',
            );

            await this.serviceDiscovery.registerService(
              SERVICE_NAME,
              { queue: 'api-gateway-queue' },
              ['gateway', 'rabbitmq'],
            );
            this.logger.log(
              'Re-registered service with Consul after health check failure',
            );
            this.rabbitMQClient.emit('restart', {});
            this.logger.log(
              'Restarted microservice to re-register consumers after health check failure',
            );
            break;
          } catch (reconnectError) {
            this.logger.warn(
              `Reconnect failed during health check, retrying (${attempt + 1}/${maxAttempts})...`,
              reconnectError.message ||
                reconnectError.code ||
                reconnectError.stack ||
                'Unknown error',
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        if (!reconnected) {
          this.logger.error(
            `Failed to reconnect to RabbitMQ after ${maxAttempts} attempts during health check`,
          );
        }
      }
    }, 10000); // Giảm từ 15000 xuống 10000
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('/*path');
  }
}
