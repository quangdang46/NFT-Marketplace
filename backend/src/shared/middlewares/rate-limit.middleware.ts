import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limit = 5; // Giới hạn request
  private readonly timeWindow = 60; // Thời gian chặn (giây)
  private readonly logger = new Logger(RateLimitMiddleware.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;

      // Lấy số lần request hiện tại
      const attempts = await this.redis.get(key);

      if (attempts && Number(attempts) >= this.limit) {
        throw new BadRequestException(
          `Quá nhiều yêu cầu. Hãy thử lại sau ${this.timeWindow} giây`,
        );
      }

      // Tăng số lần request
      const newAttempts = await this.redis.incr(key);

      // Chỉ đặt expire khi lần đầu tiên tạo key
      if (newAttempts === 1) {
        await this.redis.expire(key, this.timeWindow);
      }

      next();
    } catch (error) {
      this.logger.error('Lỗi Redis trong Rate Limiting', error);
      next(); // Không chặn request nếu Redis gặp sự cố
    }
  }
}
