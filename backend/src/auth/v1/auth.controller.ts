import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthV1Service } from 'src/auth/v1/auth.service';
import { JwtGuard } from 'src/auth/v1/guards/jwt/jwt.guard';
import { JwtPayload } from 'src/types/auth.types';
import { ethers } from 'ethers';

@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(private readonly authService: AuthV1Service) {}

  @HttpCode(200)
  @Post('connect-wallet')
  async connectWallet(
    @Body()
    body: {
      address: string;
      message: string;
      signature: string;
      nonce: string;
    },
    @Res() res: Response,
  ) {
    const token = await this.authService.authenticateWallet(body);
    if (!token) {
      return res.send({ message: 'Xác thực thất bại connectWallet' });
    }
    this.authService.saveTokenToCookie(res, token);
    return res.send({ message: 'Kết nối ví thành công', token });
  }

  @UseGuards(JwtGuard)
  @Post('disconnect-wallet')
  disconnectWallet(@Res() res: Response) {
    this.authService.removeTokenFromCookie(res);

    return res.send({ message: 'Đã ngắt kết nối ví' });
  }

  @Get('get-nonce')
  async getNonce(@Query('address') address: string) {
    if (!address || !ethers.isAddress(address)) {
      throw new BadRequestException('Địa chỉ ví không hợp lệ');
    }
    return this.authService.getNonce(address);
  }
  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user?: JwtPayload }) {
    return req.user;
  }
}
