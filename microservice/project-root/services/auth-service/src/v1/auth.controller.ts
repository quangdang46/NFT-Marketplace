import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtPayload } from '@project/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    console.log('Received get_nonce request');
    return this.authService.getNonce();
  }

  @MessagePattern({ cmd: 'get_me' })
  async getMe(@Payload() data: JwtPayload) {
    return { success: true, data };
  }
}
