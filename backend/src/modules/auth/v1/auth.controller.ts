import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtGuard } from '@/modules/auth/guards/jwt/jwt.guard';
import { AuthService } from '@/modules/auth/v1/auth.service';
import { JwtPayload } from '@/modules/auth/types/auth.types';

@ApiTags('Authentication') // Gán API vào nhóm "Authentication"
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('verify')
  @ApiOperation({ summary: 'Xác thực chữ ký để đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Xác thực thành công',
  })
  @ApiResponse({ status: 400, description: 'Xác thực thất bại' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Đăng nhập vào hệ thống' },
        signature: { type: 'string', example: '0xabc...def' },
      },
    },
  })
  async verifySignature(
    @Body()
    body: {
      message: string;
      signature: string;
    },
    @Res() res: Response,
  ) {
    if (!body.message || !body.signature) {
      throw new BadRequestException('Message hoặc signature không hợp lệ');
    }
    const { accessToken, refreshToken } =
      await this.authService.authenticateWallet(body);
    if (!accessToken || !refreshToken) {
      return res.send({ message: 'Xác thực thất bại connectWallet' });
    }

    this.authService.saveTokenToCookie(res, accessToken, refreshToken);
    return res.send({
      message: 'Kết nối ví thành công',
      accessToken,
      refreshToken,
    });
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Làm mới access token' })
  @ApiResponse({ status: 200, description: 'Access token mới' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'xyz...' },
      },
    },
  })
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token hoặc address không hợp lệ');
    }

    const { accessToken } = await this.authService.refreshToken(refreshToken);
    this.authService.saveTokenToCookie(res, accessToken, refreshToken);
    return res.send({ accessToken });
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Ngắt kết nối ví' })
  @ApiResponse({ status: 200, description: 'Đã ngắt kết nối ví' })
  @ApiBearerAuth()
  async disconnectWallet(
    @Req() req: Request & { user?: JwtPayload },
    @Res() res: Response,
  ) {
    await this.authService.logout(req?.user?.address || '');
    this.authService.removeTokenFromCookie(res);

    return res.send({ message: 'Đã ngắt kết nối ví' });
  }

  @Get('nonce')
  @ApiOperation({ summary: 'Lấy nonce để xác thực' })
  @ApiResponse({ status: 200, description: 'Nonce được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Địa chỉ ví không hợp lệ' })
  async getNonce(@Res() res: Response) {
    const nonce = await this.authService.getNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.send(nonce);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng' })
  @ApiBearerAuth()
  getMe(@Req() req: Request & { user?: JwtPayload }) {
    if (!req.user) {
      throw new UnauthorizedException({
        success: false,
        message: 'Unauthorized access',
      });
    }

    return {
      success: true,
      data: req.user,
    };
  }
}
