import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AuthController } from './v1/auth.controller';
import { AuthService } from './v1/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';
import {
  getRedisConfig,
  getJwtConfig,
  SharedConfigModule,
  ConfigService,
  ServiceDiscovery,
  getRabbitMQConfig,
  ServiceClient,
} from '@project/shared';
import { ClientsModule, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

const SERVICE_NAME = 'auth-service';

const IMPORTS = [
  SharedConfigModule,
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => getJwtConfig(configService),
    inject: [ConfigService],
  }),
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => getRedisConfig(configService),
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
  JwtStrategy,
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
      const rabbitMQConfig = getRabbitMQConfig(configService, SERVICE_NAME);
      await serviceDiscovery.registerService(
        SERVICE_NAME,
        { queue: rabbitMQConfig.options?.queue || `${SERVICE_NAME}-queue` },
        ['auth', 'rabbitmq'],
      );
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
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(AuthModule.name);

  constructor(
    private readonly serviceDiscovery: ServiceDiscovery,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitMQClient: ClientProxy,
  ) {}

  async onModuleInit() {
    this.logger.log(
      'AuthModule initialized, waiting for consumers to be ready...',
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
    this.logger.log('Starting health check for AuthModule');
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