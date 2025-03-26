import { Module, Logger, OnModuleInit } from '@nestjs/common';
import {
  SharedConfigModule,
  ConfigService,
  ServiceDiscovery,
  getRabbitMQConfig,
  getRedisConfig,
  getJwtConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
} from '@project/shared';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './v1/auth.controller';
import { AuthService } from './v1/auth.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';

// Định nghĩa kiểu EventsMap và Status
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'auth-service';

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
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => getJwtConfig(configService),
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

const CONTROLLERS = [AuthController];

const PROVIDERS = [
  AuthService,
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
        { queue: 'auth-service-queue' },
        ['auth', 'rabbitmq'],
      );
      const logger = new Logger('AuthModule');
      logger.log('Auth Service registered with Consul');
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
        'auth-service-queue',
        ['auth', 'rabbitmq'],
      );
    },
    inject: [ServiceDiscovery, 'RABBITMQ_SERVICE'],
  },
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(AuthModule.name);

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('Auth Module initialized');
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.error('Failed to initialize RabbitMQ client in AuthModule');
      return;
    }
    this.logger.log('RabbitMQ client initialized successfully in AuthModule');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for AuthModule');

    await this.rabbitMQHealthService.attemptInitialHealthCheck();

    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }
}
