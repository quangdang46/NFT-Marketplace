import { Module, OnModuleInit, Logger } from '@nestjs/common'; // Import các thành phần cần thiết từ NestJS
import { NFTController } from './v1/nft.controller';
import { NFTService } from './v1/nft.service';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import {
  ConfigService,
  SharedConfigModule,
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getMongoConfig,
} from '@project/shared'; // Import các thành phần từ shared module
import { ClientsModule } from '@nestjs/microservices'; // Import ClientsModule để kết nối RabbitMQ
import { Connection } from 'mongoose';

type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'nft-service';

const IMPORTS = [
  SharedConfigModule,
  MongooseModule.forRootAsync({
    useFactory: (configService: ConfigService) => getMongoConfig(configService),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([]),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: (configService: ConfigService) =>
        getRabbitMQConfig(configService, SERVICE_NAME),
      inject: [ConfigService],
    },
  ]),
];

const CONTROLLERS = [NFTController];

const PROVIDERS = [
  NFTService,
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, SERVICE_NAME), // Cung cấp cấu hình RabbitMQ
    inject: [ConfigService],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const discovery = new ServiceDiscovery(configService, SERVICE_NAME);
      const rabbitMQConfig = getRabbitMQConfig(configService, SERVICE_NAME);
      await discovery.registerService(
        SERVICE_NAME,
        { queue: rabbitMQConfig.options?.queue || `${SERVICE_NAME}-queue` },
        ['nft', 'rabbitmq'],
      );
      const logger = new Logger('NFTModule');
      logger.log('NFT Service registered with Consul');
      return discovery;
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
        'nft-service-queue',
        ['nft', 'rabbitmq'],
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
export class NFTModule implements OnModuleInit {
  private readonly logger = new Logger(NFTModule.name);
  constructor(
    private readonly rabbitMQHealthService: RabbitMQHealthService,
    @InjectConnection() private readonly mongooseConnection: Connection,
  ) {
    this.logger.log('NFT Module initialized');
  }

  async onModuleInit() {
    this.checkMongoDBConnection();

    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      this.logger.warn('Failed to initialize RabbitMQ client');
      return;
    }

    this.logger.log('Waiting for 10 seconds before starting health check...');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for NFTModule');
    await this.rabbitMQHealthService.attemptInitialHealthCheck();

    this.logger.log('Starting periodic health check...');
    this.rabbitMQHealthService.startPeriodicHealthCheck();
  }

  private checkMongoDBConnection() {
    const dbState = this.mongooseConnection.readyState;
    switch (dbState) {
      case 0:
        this.logger.error('MongoDB connection state: Disconnected');
        break;
      case 1:
        this.logger.log('MongoDB connection state: Connected');
        break;
      case 2:
        this.logger.log('MongoDB connection state: Connecting');
        break;
      case 3:
        this.logger.warn('MongoDB connection state: Disconnecting');
        break;
      default:
        this.logger.warn(`MongoDB connection state: Unknown (${dbState})`);
    }
  }
}
