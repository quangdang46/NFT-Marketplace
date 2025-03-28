import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { SettingsController } from '@/v1/settings.controller';
import { SettingsService } from '@/v1/settings.service';
import {
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getRedisConfig,
  getTypeOrmConfig,
} from '@project/shared';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Setting } from '@/entity/setting.entity';
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'settings-service';

const IMPORTS = [
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

  TypeOrmModule.forRootAsync({
    useFactory: () => {
      const config = getTypeOrmConfig();
      return {
        ...config,
        entities: [Setting],
      } as TypeOrmModuleOptions;
    },
    inject: [],
  }),
  TypeOrmModule.forFeature([Setting]),

  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME),
      inject: [],
    },
  ]),
];

const CONTROLLERS = [SettingsController];

const PROVIDERS = [
  SettingsService,
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: () => getRabbitMQConfig(SERVICE_NAME),
    inject: [],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async () => {
      const discovery = new ServiceDiscovery(SERVICE_NAME);
      const rabbitMQConfig = getRabbitMQConfig(SERVICE_NAME);
      await discovery.registerService(
        SERVICE_NAME,
        { queue: rabbitMQConfig.options?.queue || `${SERVICE_NAME}-queue` },
        ['settings', 'rabbitmq'],
      );
      const logger = new Logger('settingsModule');
      logger.log('settings Service registered with Consul');
      return discovery;
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
        ['settings', 'rabbitmq'],
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
export class SettingsModule implements OnModuleInit {
  private readonly logger = new Logger(SettingsModule.name);

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('settings Module initialized');
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return;
    }

    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    this.logger.log('Starting health check for settingsModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();
    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }
}
