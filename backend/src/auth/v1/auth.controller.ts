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
  @Post('connect-wallet')
  @ApiOperation({ summary: 'Xác thực ví và lấy JWT' })
  @ApiResponse({ status: 200, description: 'Kết nối ví thành công' })
  @ApiResponse({ status: 400, description: 'Lỗi xác thực' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', example: '0x123...abc' },
        message: { type: 'string', example: 'Đăng nhập vào hệ thống' },
        signature: { type: 'string', example: '0xabc...def' },
        nonce: { type: 'string', example: 'random_nonce_123' },
      },
    },
  })
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
  @ApiOperation({ summary: 'Ngắt kết nối ví' })
  @ApiResponse({ status: 200, description: 'Đã ngắt kết nối ví' })
  @ApiBearerAuth()
  disconnectWallet(@Res() res: Response) {
    this.authService.removeTokenFromCookie(res);

    return res.send({ message: 'Đã ngắt kết nối ví' });
  }

  @Get('get-nonce')
  @ApiOperation({ summary: 'Lấy nonce để xác thực' })
  @ApiResponse({ status: 200, description: 'Nonce được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Địa chỉ ví không hợp lệ' })
  @ApiQuery({ name: 'address', type: 'string', example: '0x123...abc' })
  async getNonce(@Query('address') address: string) {
    if (!address || !ethers.isAddress(address)) {
      throw new BadRequestException('Địa chỉ ví không hợp lệ');
    }
    return this.authService.getNonce(address);
  }





  @UseGuards(JwtGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng' })
  @ApiBearerAuth()
  getProfile(@Req() req: Request & { user?: JwtPayload }) {
    return req.user;
  }
}
