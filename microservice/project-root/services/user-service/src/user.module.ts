import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserController } from './v1/user.controller';
import { UserService } from './v1/user.service';
import {
  getTypeOrmConfig,
  ConfigService,
  SharedConfigModule,
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
  RabbitMQHealthService, // Import RabbitMQHealthService
  ClientProxy,
} from '@project/shared';
import { User } from '@/entities/user.entity';
import { ClientsModule } from '@nestjs/microservices';

// Định nghĩa kiểu EventsMap và Status
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

const SERVICE_NAME = 'user-service';

const IMPORTS = [
  SharedConfigModule,
  TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
      const config = getTypeOrmConfig(configService);
      return {
        ...config,
        entities: [User],
      } as TypeOrmModuleOptions;
    },
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature([User]),
  ClientsModule.registerAsync([
    {
      name: 'RABBITMQ_SERVICE',
      useFactory: (configService: ConfigService) =>
        getRabbitMQConfig(configService, SERVICE_NAME),
      inject: [ConfigService],
    },
  ]),
];

const CONTROLLERS = [UserController];

const PROVIDERS = [
  UserService,
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const discovery = new ServiceDiscovery(configService, SERVICE_NAME);
      const rabbitMQConfig = getRabbitMQConfig(configService, SERVICE_NAME);
      await discovery.registerService(
        SERVICE_NAME,
        { queue: rabbitMQConfig.options?.queue || `${SERVICE_NAME}-queue` },
        ['user', 'rabbitmq'],
      );
      const logger = new Logger('UserModule');
      logger.log('User Service registered with Consul');
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
        'user-service-queue',
        ['user', 'rabbitmq'],
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
export class UserModule implements OnModuleInit {
  private readonly logger = new Logger(UserModule.name);

  constructor(private readonly rabbitMQHealthService: RabbitMQHealthService) {
    this.logger.log('User Module initialized');
  }

  async onModuleInit() {
    const isClientReady = await this.rabbitMQHealthService.initializeRabbitMQ();
    if (!isClientReady) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for UserModule');

    await this.rabbitMQHealthService.attemptInitialHealthCheck();

    this.rabbitMQHealthService.startPeriodicHealthCheck(); // Sử dụng maxAttempts = 15, retryDelay = 2000, interval = 15000
  }
}
