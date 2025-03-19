import { InjectRedis } from "@nestjs-modules/ioredis";
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import Redis from "ioredis";

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly limit = 5; // Giới hạn request
  private readonly timeWindow = 60; // Thời gian chặn (giây)
  private readonly logger = new Logger(RateLimitMiddleware.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const key = `rate_limit:${ip}`;

      const attempts = await this.redis.get(key);

      if (attempts && Number(attempts) >= this.limit) {
        throw new BadRequestException(
          `Quá nhiều yêu cầu. Hãy thử lại sau ${this.timeWindow} giây`
        );
      }

      const newAttempts = await this.redis.incr(key);

      if (newAttempts === 1) {
        await this.redis.expire(key, this.timeWindow);
      }

      next();
    } catch (error) {
      this.logger.error("Lỗi Redis trong Rate Limiting", error);
      next(); // Không chặn request nếu Redis lỗi
    }
  }
}
