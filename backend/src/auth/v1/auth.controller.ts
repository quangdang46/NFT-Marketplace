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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthV1Service } from 'src/auth/v1/auth.service';
import { JwtGuard } from 'src/auth/v1/guards/jwt/jwt.guard';
import { JwtPayload } from 'src/types/auth.types';
import { ethers } from 'ethers';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Authentication') // Gán API vào nhóm "Authentication"
@Controller({ path: 'auth', version: '1' })
export class AuthV1Controller {
  constructor(private readonly authService: AuthV1Service) {}

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
    const token = await this.authService.authenticateWallet(body);
    if (!token) {
      return res.send({
        message: 'Xác thực thất bại connectWallet',
      });
    }
    this.authService.saveTokenToCookie(res, token);
    return res.send({ message: 'Kết nối ví thành công', token });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Ngắt kết nối ví' })
  @ApiResponse({ status: 200, description: 'Đã ngắt kết nối ví' })
  @ApiBearerAuth()
  disconnectWallet(@Res() res: Response) {
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
