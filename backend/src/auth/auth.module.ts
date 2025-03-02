import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Jwt } from './strategies/jwt/jwt.strategy';

@Module({
  providers: [AuthService, Jwt],
  controllers: [AuthController],
})
export class AuthModule {}
