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
} from '@project/shared';
import { User } from '@/entities/user.entity';
import { ClientsModule, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

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
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, SERVICE_NAME),
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
        ['user', 'rabbitmq'],
      );
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
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class UserModule implements OnModuleInit {
  private readonly logger = new Logger(UserModule.name);

  constructor(
    private readonly serviceDiscovery: ServiceDiscovery,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'UserModule initialized, waiting for consumers to be ready...',
    );
    // Kiểm tra consumer sẵn sàng
    let consumerReady = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        await this.rabbitMQClient.connect();
        consumerReady = true;
        this.logger.log('RabbitMQ consumer is ready');
        break;
      } catch (error) {
        this.logger.warn(`Consumer not ready, retrying (${attempt + 1}/10)...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!consumerReady) {
      this.logger.error(
        'Failed to initialize RabbitMQ consumer after 10 attempts',
      );
      return;
    }

    // Trì hoãn thêm 5 giây
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Bắt đầu health check
    this.logger.log('Starting health check for UserModule');
    this.serviceDiscovery.passHealthCheck().catch((error) => {
      this.logger.error(`Initial health check failed: ${error.message}`);
    });

    setInterval(() => {
      this.serviceDiscovery.passHealthCheck().catch((error) => {
        this.logger.error(`Periodic health check failed: ${error.message}`);
      });
    }, 15000);
  }
}