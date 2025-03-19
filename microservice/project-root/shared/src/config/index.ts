import { RedisModuleOptions } from "@nestjs-modules/ioredis";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getRabbitMQConfig = (
  configService: ConfigService,
  servicePrefix: string
) => ({
  urls: [configService.get<string>("RABBITMQ_URL", "amqp://rabbitmq:5672")],
  queue: configService.get<string>(
    `${servicePrefix}_SERVICE_QUEUE`,
    `${servicePrefix.toLowerCase()}_queue`
  ),
  queueOptions: { durable: false },
});

export const getTypeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("POSTGRES_HOST", "postgres"),
  port: configService.get<number>("POSTGRES_PORT", 5432),
  username: configService.get<string>("POSTGRES_USER", "postgres"),
  password: configService.get<string>("POSTGRES_PASSWORD", "postgres"),
  database: configService.get<string>("POSTGRES_DB", "users_db"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: configService.get<string>("NODE_ENV") !== "production",
});

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>("JWT_SECRET", "your-secret-key"),
  signOptions: { expiresIn: "1h" },
});

export const getRedisConfig = (
  configService: ConfigService
): RedisModuleOptions => ({
  url: configService.get<string>("REDIS_URL", "redis://redis:6379"),
  type: "single",
});

export const getConsulConfig = (
  configService: ConfigService,
  servicePrefix: string
) => ({
  host: configService.get<string>("CONSUL_HOST", "consul"),
  port: configService.get<string>("CONSUL_PORT", "8500"),
  serviceName: configService.get<string>(
    `${servicePrefix}_SERVICE_NAME`,
    `${servicePrefix.toLowerCase()}-service`
  ),
});
