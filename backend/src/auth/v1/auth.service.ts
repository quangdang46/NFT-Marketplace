import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { v4 as uuidv4 } from 'uuid';
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

  async authenticateWallet(body: { message: string; signature: string }) {
    const { message, signature } = body;
    const address = ethers.verifyMessage(message, signature);

    let user = await this.userRepository.findOne({ where: { address } });
    if (!user) {
      user = this.userRepository.create({ address });
      await this.userRepository.save(user);
    }

    // Tạo JWT
    const payload = { address };
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

  async getNonce() {
    const nonce = Math.random().toString(36).substring(2, 15);
    const key = `nonce:${uuidv4()}`; // Key không liên quan đến address
    await this.redis.set(key, nonce, 'EX', 300);

    return { nonce };
  }
}
