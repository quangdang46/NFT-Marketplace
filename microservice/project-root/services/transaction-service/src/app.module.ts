import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TransactionController } from '@/v1/transaction.controller';
import { TransactionService } from '@/v1/transaction.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import {
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getTypeOrmConfig,
} from '@project/shared';
import { ClientsModule } from '@nestjs/microservices';
import { Transaction } from '@/entity/transaction.entity';

type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'transaction-service';

const IMPORTS = [
  TypeOrmModule.forRootAsync({
    useFactory: () => {
      const config = getTypeOrmConfig();
      return {
        ...config,
        entities: [Transaction],
      } as TypeOrmModuleOptions;
    },
    inject: [],
  }),
  TypeOrmModule.forFeature([Transaction]),

  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME),
      inject: [],
    },
  ]),
];

const CONTROLLERS = [TransactionController];

const PROVIDERS = [
  TransactionService,
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
        ['transaction', 'rabbitmq'],
      );
      const logger = new Logger('transactionModule');
      logger.log('transaction Service registered with Consul');
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
        ['transaction', 'rabbitmq'],
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
export class TransactionModule implements OnModuleInit {
  private readonly logger = new Logger(TransactionModule.name);

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('transaction Module initialized');
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return;
    }

    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));
    this.logger.log('Starting health check for transactionModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();
    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }
}
