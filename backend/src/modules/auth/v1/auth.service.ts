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
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ethers } from 'ethers';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/infrastructure/database/entities/user.entity';
import { Log } from '@/infrastructure/database/mongodb/schemas/log.schema';
import { JwtPayload } from '@/modules/auth/types/auth.types';
import {
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REDIS_REFRESH_TOKEN_EXPIRES_IN,
  REDIS_EXPIRES_IN,
  REDIS_NONCE_EXPIRES_IN,
  COOKIE_EXPIRES_IN,
  COOKIE_REFRESH_TOKEN_EXPIRES_IN,
} from '@/modules/auth/constants/auth.constant';
import { IAuthService } from '@/modules/auth/interfaces/auth.interface';
@Injectable()
export class AuthService implements IAuthService {
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

    // Parse message SIWE để lấy nonce
    const nonceMatch = message.match(/Nonce: (\w+)/);
    if (!nonceMatch) throw new BadRequestException('Message không chứa nonce');
    const nonce = nonceMatch[1];

    const keys = await this.redis.keys('nonce:*');
    let foundKey: string | undefined;
    for (const key of keys) {
      const storedNonce = await this.redis.get(key);
      if (storedNonce === nonce) {
        foundKey = key;
        break;
      }
    }

    if (!foundKey) {
      throw new BadRequestException('Nonce không hợp lệ hoặc đã hết hạn');
    }

    // Tìm hoặc tạo user
    let user = await this.userRepository.findOne({ where: { address } });
    if (!user) {
      user = this.userRepository.create({
        address,
        created_at: new Date(),
        last_login_at: new Date(),
      });
    } else {
      user.last_login_at = new Date();
    }
    await this.userRepository.save(user);

 
    // Tạo tokens
    const payload: JwtPayload = {
      address: user.address,
      id: user.id,
      // Thêm các thông tin cần thiết khác vào payload
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, { expiresIn: JWT_EXPIRES_IN }),
      this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_EXPIRES_IN }),
    ]);

    // Lưu tokens vào Redis
    await Promise.all([
      this.redis.set(
        `refresh:${address}`,
        refreshToken,
        'EX',
        REDIS_REFRESH_TOKEN_EXPIRES_IN,
      ),
      this.redis.set(`token:${address}`, accessToken, 'EX', REDIS_EXPIRES_IN),
      this.redis.del(foundKey), // Xóa nonce đã sử dụng
    ]);

    await this.redis.del(foundKey); // Xóa nonce sau khi dùng
    // Ghi log vào MongoDB
    await this.logModel.create({
      address,
      action: 'connect-wallet',
      timestamp: new Date(),
    });

    return { accessToken, refreshToken };
  }

  // Lưu token vào cookie
  saveTokenToCookie(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('auth_token', accessToken, {
      maxAge: COOKIE_EXPIRES_IN, // Hết hạn sau 1 ngày
      httpOnly: true, // Cookie không thể truy cập từ JavaScript
      secure: true, // Chỉ gửi qua HTTPS secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Ngăn chặn CSRF
    });

    res.cookie('refresh_token', refreshToken, {
      maxAge: COOKIE_REFRESH_TOKEN_EXPIRES_IN, // 7 ngày
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  // Xóa token khỏi cookie
  removeTokenFromCookie(res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  async getNonce() {
    const nonce = Math.random().toString(36).substring(2, 15);
    const nonceKey = `nonce:${uuidv4()}`;
    await this.redis.set(nonceKey, nonce, 'EX', REDIS_NONCE_EXPIRES_IN);

    return { nonce };
  }

  async logout(address: string) {
    await this.redis.del(`token:${address}`);
    await this.redis.del(`refresh:${address}`); // Xóa refresh token
  }
  async refreshToken(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    const address = payload.address;
    const storedRefreshToken = await this.redis.get(`refresh:${address}`);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const newAccessToken = this.jwtService.sign(
      { address },
      { expiresIn: JWT_EXPIRES_IN },
    );
    await this.redis.set(
      `token:${address}`,
      newAccessToken,
      'EX',
      REDIS_EXPIRES_IN,
    );
    return { accessToken: newAccessToken };
  }
}
