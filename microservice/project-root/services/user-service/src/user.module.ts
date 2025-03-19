import { Module } from '@nestjs/common';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserController } from './v1/user.controller';
import { UserService } from './v1/user.service';
import { ConsulService } from './v1/consul.service';
import { User } from './entities/user.entity';
import {  getTypeOrmConfig } from '@project/shared';

const IMPORTS = [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
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
    provide: ConsulService,
    useFactory: async (configService: ConfigService) => {
      const consulService = new ConsulService(configService);
      await consulService.registerService('user-service', {
        queue: 'user_queue',
      });
      return consulService;
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
