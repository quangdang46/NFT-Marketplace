import { Module } from '@nestjs/common';
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
];
const CONTROLLERS = [AuthController];
const PROVIDERS = [
  AuthService,
  JwtStrategy,
  {
    provide: ServiceClient,
    useFactory: (options: any, discovery: ServiceDiscovery) => {
      return new ServiceClient(options, discovery, ['user-service']); // Khởi tạo trước user-service
    },
    inject: ['RABBITMQ_OPTIONS', ServiceDiscovery],
  },
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, 'auth-service'),
    inject: [ConfigService],
  },
  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const serviceDiscovery = new ServiceDiscovery(configService, 'auth-service');
      await serviceDiscovery.registerService(
        'auth-service',
        { queue: 'auth-service-queue' },
        ['auth', 'rabbitmq'],
      );
      return serviceDiscovery;
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AuthModule {}
