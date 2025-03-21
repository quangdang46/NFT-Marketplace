import { Module } from '@nestjs/common';
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
];

const CONTROLLERS = [UserController];

const PROVIDERS = [
  UserService,
  {
    provide: ServiceClient,
    useFactory: (options: any, discovery: ServiceDiscovery) => {
      return new ServiceClient(options, discovery, []); // Khởi tạo trước order-service
    },
    inject: ['RABBITMQ_OPTIONS', ServiceDiscovery],
  },
  {
    provide: 'RABBITMQ_OPTIONS',
    useFactory: (configService: ConfigService) =>
      getRabbitMQConfig(configService, 'user-service'),
    inject: [ConfigService],
  },

  {
    provide: ServiceDiscovery,
    useFactory: async (configService: ConfigService) => {
      const discovery = new ServiceDiscovery(configService, 'user-service');
      await discovery.registerService(
        'user-service',
        { queue: 'user-service-queue' },
        ['user', 'rabbitmq'],
      );
      return discovery;
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class UserModule {}
