import { Module, OnModuleInit, Logger } from '@nestjs/common'; // Import các thành phần cần thiết từ NestJS
import { CollectionController } from '@/v1/collection.controller'; // Import collectionController
import { CollectionService } from '@/v1/collection.service'; // Import collectionService
import {
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getMongoConfig,
} from '@project/shared'; // Import các thành phần từ shared module
import { ClientsModule } from '@nestjs/microservices'; // Import ClientsModule để kết nối RabbitMQ
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from '@/entity/collection.entity';

type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'collection-service';

const IMPORTS = [
  MongooseModule.forRootAsync({
    useFactory: () => getMongoConfig(),
    inject: [],
  }),
  MongooseModule.forFeature([
    { name: Collection.name, schema: CollectionSchema },
  ]),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME), // Lấy cấu hình RabbitMQ
      inject: [],
    },
  ]),
];

const CONTROLLERS = [CollectionController];

const PROVIDERS = [
  CollectionService,
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
        ['collection', 'rabbitmq'],
      );
      const logger = new Logger('CollectionModule');
      logger.log('Collection Service registered with Consul');
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
        'collection-service-queue', // Queue của collection-service
        ['collection', 'rabbitmq'], // Tags cho health check
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
export class CollectionModule implements OnModuleInit {
  private readonly logger = new Logger(CollectionModule.name); // Tạo logger cho module

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('Collection Module initialized'); // Ghi log khi module được khởi tạo
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return;
    }

    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for collectionModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();

    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }
}
