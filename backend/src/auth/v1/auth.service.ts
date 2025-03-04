import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/database/entities/user.entity';
import { Log } from 'src/database/mongodb/schemas/log.schema';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { ethers } from 'ethers';

@Injectable()
export class AuthV1Service {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  verifySignature = (
    address: string,
    message: string,
    signature: string,
  ): boolean => {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      return false; // Nếu verify thất bại, trả về false để tránh lỗi hệ thống
    }
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

    const storedNonce = await this.cacheManager.get<string>(`nonce:${address}`);
    if (!storedNonce || storedNonce !== nonce) {
      throw new Error('Nonce không hợp lệ');
    }

    await this.cacheManager.del(`nonce:${address}`);

    if (!this.verifySignature(address, message, signature)) {
      throw new Error('Xác thực thất bại verifySignature');
    }

    let user = await this.userRepository.findOne({ where: { address } });
    if (!user) {
      user = this.userRepository.create({ address });
      await this.userRepository.save(user);
    }

    // Tạo JWT
    const payload = { sub: address };
    const token = this.jwtService.sign(payload);

    await this.cacheManager.set(`token:${address}`, token, 24 * 60 * 60);

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
    let nonce = await this.cacheManager.get<string>(`nonce:${address}`);

    if (!nonce) {
      // Tạo nonce mới nếu chưa có
      nonce = Math.random().toString(36).substring(2, 15);
      await this.cacheManager.set(`nonce:${address}`, nonce, 300); // TTL: 5 phút
    }

    return { address, nonce };
  }
}
