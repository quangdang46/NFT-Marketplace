import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard, AuthRequest } from '@project/shared';
import { AuthResponse, User } from '@/graphql/types/auth.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly gatewayService: GatewayService) {
    console.log('AuthResolver created');
  }

  @Query(() => String)
  async nonce() {
    const { nonce }: { nonce: string } =
      await this.gatewayService.sendToService(
        'auth-service',
        { cmd: 'get_nonce' },
        {},
      );
    return nonce;
  }

  @Mutation(() => AuthResponse)
  async verify(
    @Args('message') message: string,
    @Args('signature') signature: string,
    @Context() context: { res: any }, // Để lưu cookie
  ) {
    const { accessToken, refreshToken } =
      await this.gatewayService.sendToService<{
        accessToken: string;
        refreshToken: string;
      }>('auth-service', { cmd: 'verify_signature' }, { message, signature });

    this.gatewayService.saveTokenToCookie(
      context.res,
      accessToken,
      refreshToken,
    );
    return { accessToken, refreshToken };
  }

  @Query(() => User)
  @UseGuards(JwtGuard)
  async me(@Context() context: { req: AuthRequest }) {
    const user = context.req.user;
    return this.gatewayService.sendToService(
      'auth-service',
      { cmd: 'get_me' },
      user,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard)
  async logout(@Context() context: { req: AuthRequest; res: any }) {
    const user = context.req.user;
    if (!user) throw new Error('User not authenticated');

    await this.gatewayService.sendToService<void>(
      'auth-service',
      { cmd: 'logout' },
      { address: user.address },
    );
    this.gatewayService.removeTokenFromCookie(context.res);
    return true;
  }

  @Mutation(() => AuthResponse)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
    @Context() context: { res: any },
  ) {
    const { accessToken }: { accessToken: string } =
      await this.gatewayService.sendToService(
        'auth-service',
        { cmd: 'refresh_token' },
        { refreshToken },
      );
    this.gatewayService.saveTokenToCookie(
      context.res,
      accessToken,
      refreshToken,
    );
    return { accessToken, refreshToken };
  }
}
