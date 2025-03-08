import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { NftModule } from '@/modules/nft/nft.module';
import { AllExceptionsFilter } from '@/shared/filters/AllExceptionsFilter';
import { RateLimitMiddleware } from '@/shared/middlewares/rate-limit.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Đọc biến môi trường từ .env
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Tự động tạo schema
      playground: true, // Bật GraphQL Playground
    }),
    AuthModule,
    UserModule,
    NftModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('/*path'); // Áp dụng middleware cho tất cả các route
  }
}
