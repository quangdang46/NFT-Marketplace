import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/infrastructure/database/entities/user.entity';
import { AuthService } from '@/modules/auth/v1/auth.service';
import { JwtStrategy } from '@/modules/auth/strategies/jwt/jwt.strategy';
import { AuthController } from '@/modules/auth/v1/auth.controller';
import { MongodbModule } from '@/infrastructure/database/mongodb/mongodb.module';
import { JWT_EXPIRES_IN } from '@/modules/auth/constants/auth.constant';
@Module({
  imports: [
    ConfigModule, // Đảm bảo module này được import
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lấy từ .env
        signOptions: { expiresIn: JWT_EXPIRES_IN },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    MongodbModule, // Import module MongoDB vào đây
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
