import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/database/entities/user.entity';
import { Log } from 'src/database/mongodb/schemas/log.schema';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ethers } from 'ethers';
import { Redis } from 'ioredis';
@Injectable()
export class AuthV1Service {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  verifySignature = (
    address: string,
    message: string,
    signature: string,
  ): boolean => {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  };

  async authenticateWallet(body: {
    address: string;
    message: string;
    signature: string;
    nonce: string;
  }) {
    const { address, message, signature, nonce } = body;

    if (!address || !ethers.isAddress(address)) {
      throw new BadRequestException('Địa chỉ ví không hợp lệ');
    }

    const storedNonce = await this.redis.get(`nonce:${address}`);
    if (!storedNonce || storedNonce !== nonce) {
      throw new UnauthorizedException('Nonce không hợp lệ');
    }

    await this.redis.del(`nonce:${address}`);

    if (!this.verifySignature(address, message, signature)) {
      throw new UnauthorizedException('Xác thực thất bại verifySignature');
    }

    let user = await this.userRepository.findOne({ where: { address } });
    if (!user) {
      user = this.userRepository.create({ address });
      await this.userRepository.save(user);
    }

    // Tạo JWT
    const payload = { sub: address };
    const token = this.jwtService.sign(payload);

    await this.redis.set(`token:${address}`, token, 'EX', 24 * 60 * 60);

    // Ghi log vào MongoDB
    await this.logModel.create({
      address,
      action: 'connect-wallet',
      timestamp: new Date(),
    });

    return token;
  }

  // Lưu token vào cookie
  saveTokenToCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      maxAge: 24 * 60 * 60 * 1000, // Hết hạn sau 1 ngày
      httpOnly: true, // Cookie không thể truy cập từ JavaScript
      secure: true, // Chỉ gửi qua HTTPS secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Ngăn chặn CSRF
    });
  }

  // Xóa token khỏi cookie
  removeTokenFromCookie(res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  async getNonce(address: string) {
    if (!address || !ethers.isAddress(address)) {
      throw new BadRequestException('Địa chỉ ví không hợp lệ');
    }

    // Kiểm tra nonce trong Redis
    let nonce = await this.redis.get(`nonce:${address}`);

    if (!nonce) {
      // Tạo nonce mới nếu chưa có
      nonce = Math.random().toString(36).substring(2, 15);
      await this.redis.set(`nonce:${address}`, nonce, 'EX', 300);
    }

    return { address, nonce };
  }
}
