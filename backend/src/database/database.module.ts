import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { NFT } from './entities/nft.entity';
import { RedisModule as AppRedisModule } from './redis/redis.module';
import { MongodbModule } from './mongodb/mongodb.module';
import { Transaction } from './entities/transaction.entity';
import { Listing } from './entities/listing.entity';
import { Bid } from './entities/bid.entity';
import { Collection } from './entities/collection.entity';
import { NFTCollection } from './entities/nft_collection.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          NFT,
          Transaction,
          Listing,
          Bid,
          Collection,
          NFTCollection,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    AppRedisModule,
    MongodbModule,
  ],
})
export class DatabaseModule {}
