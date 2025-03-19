import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GatewayService } from '../gateway.service';
import { AuthRequest } from '@project/shared';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post('verify')
  async verifySignature(
    @Body() body: { message: string; signature: string },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.gatewayService.sendToService<{
        accessToken: string;
        refreshToken: string;
      }>('auth-service', { cmd: 'verify_signature' }, body);
    this.gatewayService.saveTokenToCookie(res, accessToken, refreshToken);
    return res.send({
      message: 'Kết nối ví thành công',
      accessToken,
      refreshToken,
    });
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    const { accessToken }: { accessToken: string } =
      await this.gatewayService.sendToService(
        'auth-service',
        { cmd: 'refresh_token' },
        { refreshToken },
      );
    this.gatewayService.saveTokenToCookie(res, accessToken, refreshToken);
    return res.send({ accessToken });
  }

  // @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Req() req: AuthRequest, @Res() res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await this.gatewayService.sendToService<void>(
      'auth-service',
      { cmd: 'logout' },
      { address: req.user.address },
    );
    this.gatewayService.removeTokenFromCookie(res);
    return res.send({ message: 'Đã ngắt kết nối ví' });
  }

  @Get('nonce')
  async getNonce(@Res() res: Response) {
    const { nonce }: { nonce: string } =
      await this.gatewayService.sendToService(
        'auth-service',
        { cmd: 'get_nonce' },
        {},
      );
    res.setHeader('Content-Type', 'text/plain');
    res.send(nonce);
  }

  // @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    return this.gatewayService.sendToService(
      'auth-service',
      { cmd: 'get_me' },
      req.user,
    );
  }
}
