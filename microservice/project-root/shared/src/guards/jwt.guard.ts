import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthRequest, JwtPayload } from "../interfaces/auth.interface";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const secret = this.configService.get<string>("JWT_SECRET"); // Lấy secret từ ConfigService
      if (!secret) throw new Error("JWT_SECRET is not set");
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      request.user = decoded;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
