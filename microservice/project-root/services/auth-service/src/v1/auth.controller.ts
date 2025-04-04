import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtPayload } from '@project/shared';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {
    this.logger.log('AuthController initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for api-gateway-queue');
    // Logic để đăng ký lại consumer nếu cần
  }

  @MessagePattern({ cmd: 'verify_signature' })
  async verifySignature(
    @Payload() data: { message: string; signature: string },
  ) {
    return this.authService.authenticateWallet(data);
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async refresh(@Payload() data: { refreshToken: string }) {
    return this.authService.refreshToken(data.refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Payload() data: { address: string }) {
    await this.authService.logout(data.address);
    return { message: 'Đã ngắt kết nối ví' };
  }

  @MessagePattern({ cmd: 'get_nonce' })
  async getNonce() {
    this.logger.log('get_nonce');
    return this.authService.getNonce();
  }

  @MessagePattern({ cmd: 'get_me' })
  async getMe(@Payload() data: JwtPayload) {
    return data;
  }
}
