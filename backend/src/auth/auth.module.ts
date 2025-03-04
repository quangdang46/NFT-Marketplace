import { Module } from '@nestjs/common';
import { AuthV1Controller } from 'src/auth/v1/auth.controller';
import { AuthV1Service } from 'src/auth/v1/auth.service';
import { JwtStrategyV1 } from 'src/auth/v1/strategies/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongodbModule } from 'src/database/mongodb/mongodb.module';
@Module({
  imports: [
    ConfigModule, // Đảm bảo module này được import
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lấy từ .env
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    MongodbModule, // Import module MongoDB vào đây
  ],
  providers: [AuthV1Service, JwtStrategyV1],
  controllers: [AuthV1Controller],
})
export class AuthModule {}
