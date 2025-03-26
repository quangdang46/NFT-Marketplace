import { RedisModuleOptions } from "@nestjs-modules/ioredis";
import { ConfigService } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { RmqOptions } from "@nestjs/microservices";

export const getRabbitMQConfig = (
  configService: ConfigService,
  servicePrefix: string
): RmqOptions => {
  const url = configService.get<string>(
    "RABBITMQ_URL",
    "amqp://localhost:5672"
  );
  const queue = configService.get<string>(
    `${servicePrefix.toUpperCase()}-NAME`,
    `${servicePrefix.toLowerCase()}-queue`
  );
  console.log(`[RabbitMQ Config] URL: ${url}, Queue: ${queue}`);
  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: { durable: true },
      persistent: true,
      socketOptions: {
        heartbeat: 60, 
        reconnectTimeInSeconds: 5,
        connectionTimeout: 10000,
      },
    },
  };
};

export const getTypeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const host = configService.get<string>("POSTGRES_HOST", "localhost");
  const port = configService.get<number>("POSTGRES_PORT", 5433);
  const username = configService.get<string>("POSTGRES_USER", "postgres");
  const password = configService.get<string>("POSTGRES_PASSWORD", "localhost");
  const database = configService.get<string>("POSTGRES_DB", "nftmarket");
  console.log(
    `[TypeOrm Config] Host: ${host}:${port}, Database: ${database}, User: ${username}`
  );
  return {
    type: "postgres",
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: configService.get<string>("NODE_ENV") !== "production",
  };
};

export const getJwtConfig = (configService: ConfigService) => {
  const secret = configService.get<string>("JWT_SECRET", "your-secret-key");
  console.log(`[JWT Config] Secret length: ${secret.length}`);
  return {
    secret,
    signOptions: { expiresIn: "1h" },
  };
};

export const getRedisConfig = (
  configService: ConfigService
): RedisModuleOptions => {
  const url = configService.get<string>("REDIS_URL", "redis://localhost:6379");
  console.log(`[Redis Config] URL: ${url}`);
  return {
    url,
    type: "single",
  };
};

export const getConsulConfig = (
  configService: ConfigService,
  servicePrefix: string
) => {
  const host = configService.get<string>("CONSUL_HOST", "localhost");
  const port = configService.get<string>("CONSUL_PORT", "8500");
  const serviceName = configService.get<string>(
    `${servicePrefix.toUpperCase()}-NAME`,
    `${servicePrefix.toLowerCase()}`
  );
  console.log(`[Consul Config] Host: ${host}:${port}, Service: ${serviceName}`);
  return {
    host,
    port,
    serviceName,
  };
};
