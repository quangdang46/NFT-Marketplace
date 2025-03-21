import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import {
  REDIS_REFRESH_TOKEN_EXPIRES_IN,
  REDIS_EXPIRES_IN,
  REDIS_NONCE_EXPIRES_IN,
  JwtPayload,
  ServiceClient,
} from '@project/shared';
import { IAuthService } from '@/interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly serviceClient: ServiceClient,
  ) {}

  async authenticateWallet(body: { message: string; signature: string }) {
    const { message, signature } = body;
    const address = ethers.verifyMessage(message, signature);

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

    const user: {
      address: string;
      id: number;
    } = await this.serviceClient.sendToService(
      'user-service',
      { cmd: 'get_user' },
      { address },
    );
    if (!user) throw new UnauthorizedException('User not found');

    const payload: JwtPayload = { address: user.address, id: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, { expiresIn: '7d' }),
    ]);

    await Promise.all([
      this.redis.set(
        `refresh:${address}`,
        refreshToken,
        'EX',
        REDIS_REFRESH_TOKEN_EXPIRES_IN,
      ),
      this.redis.set(`token:${address}`, accessToken, 'EX', REDIS_EXPIRES_IN),
      this.redis.del(foundKey),
    ]);

    return { accessToken, refreshToken };
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

    const newAccessToken = this.jwtService.sign({ address, id: payload.id });
    await this.redis.set(
      `token:${address}`,
      newAccessToken,
      'EX',
      REDIS_EXPIRES_IN,
    );
    return { accessToken: newAccessToken };
  }

  async logout(address: string) {
    await Promise.all([
      this.redis.del(`token:${address}`),
      this.redis.del(`refresh:${address}`),
    ]);
  }

  async getNonce() {
    const nonce = Math.random().toString(36).substring(2, 15);
    const nonceKey = `nonce:${uuidv4()}`;
    await this.redis.set(nonceKey, nonce, 'EX', REDIS_NONCE_EXPIRES_IN);
    return { nonce };
  }
}
