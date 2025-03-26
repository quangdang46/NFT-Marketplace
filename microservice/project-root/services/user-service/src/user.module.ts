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
  ) {
    this.logger.log('User Module initialized');
  }

  async onModuleInit() {
    this.logger.log(
      'UserModule initialized, waiting for RabbitMQ client to be ready...',
    );
    let clientReady = false;
    const maxAttempts = 15;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.rabbitMQClient.connect();
        clientReady = true;
        this.logger.log('RabbitMQ client is ready');
        break;
      } catch (error) {
        this.logger.warn(
          `Client not ready, retrying (${attempt + 1}/${maxAttempts})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!clientReady) {
      this.logger.error(
        `Failed to initialize RabbitMQ client after ${maxAttempts} attempts`,
      );
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    this.logger.log('Starting health check for UserModule');
    const attemptHealthCheck = async (maxRetries = 3, retryDelay = 5000) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await this.serviceDiscovery.passHealthCheck();
          this.logger.log('Initial health check passed');
          break;
        } catch (error) {
          this.logger.error(
            `Initial health check failed (attempt ${i + 1}/${maxRetries}): ${error.message}`,
          );
          if (i < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }
    };

    await attemptHealthCheck();

    setInterval(async () => {
      try {
        await this.serviceDiscovery.passHealthCheck();
      } catch (error) {
        this.logger.error(`Periodic health check failed: ${error.message}`);
      }
    }, 15000);
  }
}
