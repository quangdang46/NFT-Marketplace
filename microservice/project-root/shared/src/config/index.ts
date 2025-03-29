import { RedisModuleOptions } from "@nestjs-modules/ioredis";
import { Transport } from "@nestjs/microservices";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { RmqOptions } from "@nestjs/microservices";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import { ethers } from "ethers";

export const getRabbitMQConfig = (servicePrefix: string): RmqOptions => {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error("RabbitMQ URL not found in environment variables");
  const queue =
    process.env[`${servicePrefix.toUpperCase()}-QUEUE`] ||
    `${servicePrefix.toLowerCase()}-queue`;
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

export const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const host = process.env.POSTGRES_HOST || "localhost";
  const port = +process.env.POSTGRES_PORT || 5433;
  const username = process.env.POSTGRES_USER || "postgres";
  const password = process.env.POSTGRES_PASSWORD || "localhost";
  const database = process.env.POSTGRES_DB || "nftmarket";
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
    synchronize: process.env.NODE_ENV !== "production",
  };
};

export const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret not found in environment variables");
  }
  console.log(`[JWT Config] Secret length: ${secret.length}`);
  return {
    secret,
    signOptions: { expiresIn: "1h" },
  };
};

export const getRedisConfig = (): RedisModuleOptions => {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  console.log(`[Redis Config] URL: ${url}`);
  return {
    url,
    type: "single",
  };
};

export const getConsulConfig = (servicePrefix: string) => {
  const host = process.env.CONSUL_HOST || "localhost";
  const port = process.env.CONSUL_PORT || "8500";

  const serviceName =
    process.env[`${servicePrefix.toUpperCase()}-NAME`] ||
    `${servicePrefix.toLowerCase()}`;
  console.log(`[Consul Config] Host: ${host}:${port}, Service: ${serviceName}`);
  return {
    host,
    port,
    serviceName,
  };
};

export const getMongoConfig = (): MongooseModuleOptions => {
  const host = process.env.MONGO_HOST || "localhost";
  const port = +process.env.MONGO_PORT || 27017;
  const username = process.env.MONGO_USERNAME || "";
  const password = process.env.MONGO_PASSWORD || "";
  const database = process.env.MONGO_DATABASE || "nftmarket";

  let uri = `mongodb://${host}:${port}/${database}`;
  if (username && password) {
    uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }
  console.log(`[MongoDB Config] URI: ${uri} Database: ${database}`);
  return {
    uri,
    autoIndex: true, // Tự động tạo index cho schema
    connectTimeoutMS: 10000, // Timeout kết nối
    serverSelectionTimeoutMS: 5000, // Timeout chọn server
  };
};

export const getPrivateKey = () => {
  const key = process.env.PRIVATE_KEY;
  if (!key) {
    throw new Error("Private Key not found in environment variables");
  }
  console.log(`[Private Key] Length: ${key.length}`);
  return key;
};

export const getChainsConfig = () => {
  return {
    "eth-sepolia": {
      provider: new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL),
      signer: new ethers.Wallet(getPrivateKey()),
    },
    "base-sepolia": {
      provider: new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL),
      signer: new ethers.Wallet(getPrivateKey()),
    },
    "polygon-mumbai": {
      provider: new ethers.JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL),
      signer: new ethers.Wallet(getPrivateKey()),
    },
  };
};

export const getMarketplace = () => {
  const marketplaceFeeRecipient = process.env.MARKETPLACE_FEE_RECIPIENT;
  const marketplaceFeePercentage = process.env.MARKETPLACE_FEE_PERCENT;
  if (!marketplaceFeeRecipient || !marketplaceFeePercentage) {
    throw new Error("Marketplace Fee not found in environment variables");
  }
  console.log(
    `[Marketplace Fee] Recipient: ${marketplaceFeeRecipient}, Percentage: ${marketplaceFeePercentage}`
  );
  return {
    marketplaceFeeRecipient,
    marketplaceFeePercentage,
  };
};

export const getPinataConfig = () => {
  const pinataJwt = process.env.PINATA_JWT;
  const pinataGateway = process.env.NEXT_PUBLIC_GATEWAY_URL;
  if (!pinataJwt || !pinataGateway) {
    throw new Error("Pinata config not found in environment variables");
  }
  console.log(`[Pinata Config] JWT: ${pinataJwt}, Gateway: ${pinataGateway}`);
  return {
    pinataJwt,
    pinataGateway,
  };
};
