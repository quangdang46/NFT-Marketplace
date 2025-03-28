import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { LogController } from '@/v1/log.controller';
import { LogService } from '@/v1/log.service';
import {
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getTypeOrmConfig,
} from '@project/shared';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Log } from '@/entity/log.entity';

type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'log-service';

const IMPORTS = [
  TypeOrmModule.forRootAsync({
    useFactory: () => {
      const config = getTypeOrmConfig();
      return {
        ...config,
        entities: [Log],
      } as TypeOrmModuleOptions;
    },
    inject: [],
  }),
  TypeOrmModule.forFeature([Log]),

  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME),
      inject: [],
    },
  ]),
];

const CONTROLLERS = [LogController];

const PROVIDERS = [
  LogService,
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
        ['log', 'rabbitmq'],
      );
      const logger = new Logger('logModule');
      logger.log('log Service registered with Consul');
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
        ['log', 'rabbitmq'],
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
export class LogModule implements OnModuleInit {
  private readonly logger = new Logger(LogModule.name);

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('log Module initialized');
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return;
    }

    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    this.logger.log('Starting health check for logModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();
    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }
}
