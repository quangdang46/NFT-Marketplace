import { Module, OnModuleInit, Logger } from '@nestjs/common'; // Import các thành phần cần thiết từ NestJS
import { NFTController } from './v1/nft.controller';
import { NFTService } from './v1/nft.service';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import {
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService,
  ClientProxy,
  getMongoConfig,
  getRedisConfig,
} from '@project/shared'; // Import các thành phần từ shared module
import { ClientsModule } from '@nestjs/microservices'; // Import ClientsModule để kết nối RabbitMQ
import { Connection } from 'mongoose';
import { NFT, NFTSchema } from '@/entity/nft.entity';
import { RedisModule } from '@nestjs-modules/ioredis';
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'nft-service';

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
  MongooseModule.forRootAsync({
    useFactory: () => getMongoConfig(),
    inject: [],
  }),
  MongooseModule.forFeature([{ name: NFT.name, schema: NFTSchema }]),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: () => getRabbitMQConfig(SERVICE_NAME),
      inject: [],
    },
  ]),
];

const CONTROLLERS = [NFTController];

const PROVIDERS = [
  NFTService,
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: () => getRabbitMQConfig(SERVICE_NAME), // Cung cấp cấu hình RabbitMQ
    inject: [],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async () => {
      const discovery = new ServiceDiscovery(SERVICE_NAME);
      // const rabbitMQConfig = getRabbitMQConfig(SERVICE_NAME);
      await discovery.registerService(
        SERVICE_NAME,
        { queue: `${SERVICE_NAME}-queue` },
        ['nft', 'rabbitmq'],
      );
      const logger = new Logger('NFTModule');
      logger.log('NFT Service registered with Consul');
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
