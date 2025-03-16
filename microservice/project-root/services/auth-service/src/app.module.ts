import { AuthController } from '@/v1/auth.controller';
import { AuthService } from '@/v1/auth.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { JwtStrategy } from '@/strategies/jwt.strategy';

const CONTROLLERS = [AuthController];
const PROVIDERS = [AuthService, JwtStrategy];
const MODULES = [ConfigModule];

@Module({
  imports: [...MODULES],
  controllers: CONTROLLERS,
  providers: PROVIDERS,
})
export class AppModule {}
