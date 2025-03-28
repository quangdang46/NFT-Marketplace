import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql"; // Thêm import
import { JwtService } from "@nestjs/jwt";
import { AuthRequest, JwtPayload } from "../interfaces/auth.interface";
import { getJwtConfig } from "../config"; // Thêm import

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request =
      gqlContext.getContext().req ||
      context.switchToHttp().getRequest<AuthRequest>();
    if (!request)
      throw new UnauthorizedException("No request found in context");

    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const secret = getJwtConfig().secret;
      if (!secret) throw new Error("JWT_SECRET is not set");
      console.log(`[JWT Config] Secret length: ${secret.length}`);
      if (!secret) throw new Error("JWT_SECRET is not set");
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      request.user = decoded;
      console.log("Decoded JWT payload:", decoded); // Log payload
      return true;
    } catch (error: any) {
      console.error("JWT verification error:", error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}

export { JwtService };
