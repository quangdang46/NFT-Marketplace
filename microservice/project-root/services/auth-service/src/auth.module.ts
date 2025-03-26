import { Module, Logger, OnModuleInit } from '@nestjs/common';
import {
  SharedConfigModule,
  ConfigService,
  ServiceDiscovery,
  getRabbitMQConfig,
  getRedisConfig,
  getJwtConfig,
  ServiceClient,
} from '@project/shared';
import { ClientsModule, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { AuthController } from './v1/auth.controller';
import { AuthService } from './v1/auth.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';

const SERVICE_NAME = 'auth-service';

const IMPORTS = [
  SharedConfigModule,
  RedisModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      ...getRedisConfig(configService),
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
    inject: [ConfigService],
  }),
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => getJwtConfig(configService),
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
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const serviceDiscovery = new ServiceDiscovery(
        configService,
        SERVICE_NAME,
      );
      await serviceDiscovery.registerService(
        SERVICE_NAME,
        { queue: 'auth-service-queue' },
        ['auth', 'rabbitmq'],
      );
      const logger = new Logger('AuthModule');
      logger.log('Auth Service registered with Consul');
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
  ) {
    this.logger.log('Auth Module initialized');
  }

  async onModuleInit() {
    this.logger.log(
      'AuthModule initialized, waiting for RabbitMQ client to be ready...',
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

    this.logger.log('Starting health check for AuthModule');
    const attemptHealthCheck = async (maxRetries = 3, retryDelay = 5000) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          await this.serviceDiscovery.passHealthCheck();
          this.logger.log('Initial health check passed');
          return; // Thoát nếu health check thành công
        } catch (error) {
          this.logger.error(
            `Initial health check failed (attempt ${i + 1}/${maxRetries}): ${error.message}`,
          );
          if (i < maxRetries - 1) {
            this.logger.log(`Retrying health check after ${retryDelay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }
      this.logger.error(
        'Failed to pass initial health check after all retries',
      );
    };

    await attemptHealthCheck();

    setInterval(async () => {
      try {
        await this.serviceDiscovery.passHealthCheck();
      } catch (error) {
        this.logger.error(`Periodic health check failed: ${error.message}`);
        // Thử kết nối lại RabbitMQ nếu health check thất bại
        try {
          await this.rabbitMQClient.connect();
          this.logger.log('Reconnected to RabbitMQ after health check failure');
        } catch (reconnectError) {
          this.logger.error(
            `Failed to reconnect to RabbitMQ: ${reconnectError.message}`,
          );
        }
      }
    }, 15000);
  }
}
