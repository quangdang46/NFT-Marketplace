import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './v1/auth.controller';
import { AuthService } from './v1/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RabbitMQUserClient } from './v1/rabbitmq-user-client';
import { ConfigModule, getJwtConfig, getRedisConfig } from '@project/shared';
const IMPORTS = [
  ConfigModule,
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
    provide: 'USER_CLIENT',
    useClass: RabbitMQUserClient,
  },
];

@Module({
  imports: IMPORTS,
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AuthModule {}
