// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from "@nestjs/common";
// import { ConfigService } from "../config/shared-config.module";
// import { JwtService } from "@nestjs/jwt";
// import { AuthRequest, JwtPayload } from "../interfaces/auth.interface";

// @Injectable()
// export class JwtGuard implements CanActivate {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<AuthRequest>();
//     const authHeader = request.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       throw new UnauthorizedException("Missing or invalid token");
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//       const secret = this.configService.get<string>(
//         "JWT_SECRET",
//         "your-secret-key"
//       ); 
//       console.log(`[JWT Config] Secret length: ${secret.length}`);
//       if (!secret) throw new Error("JWT_SECRET is not set");
//       const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
//         secret,
//       });
//       request.user = decoded;
//       return true;
//     } catch (error: any) {
//       throw new UnauthorizedException("Invalid or expired token");
//     }
//   }
// }

// export { JwtService };



import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql"; // Thêm import
import { ConfigService } from "../config/shared-config.module";
import { JwtService } from "@nestjs/jwt";
import { AuthRequest, JwtPayload } from "../interfaces/auth.interface";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

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
      const secret = this.configService.get<string>(
        "JWT_SECRET",
        "your-secret-key"
      );
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