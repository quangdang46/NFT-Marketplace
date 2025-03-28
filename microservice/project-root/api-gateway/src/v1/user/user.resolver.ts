import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GatewayService } from '@/v1/gateway.service';
import { JwtGuard } from '@project/shared';
import {
  CreateUserResponse,
  User,
  VerifyUserResponse,
} from '@/graphql/types/user.type';

@Resolver()
export class UserResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => CreateUserResponse)
  @UseGuards(JwtGuard)
  async createUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('_address') address: string,
    @Args('role', { nullable: true }) role: string,
  ) {
    const result: {
      userId: string;
    } = await this.gatewayService.sendToService(
      'user-service',
      { cmd: 'create_user' },
      { username, email, address, role },
    );
    return { userId: result.userId };
  }

  @Mutation(() => VerifyUserResponse)
  @UseGuards(JwtGuard)
  async verifyUser(@Args('userId') userId: string) {
    const result: {
      status: boolean;
    } = await this.gatewayService.sendToService(
      'user-service',
      { cmd: 'verify_user' },
      { userId },
    );
    return { status: result.status };
  }

  @Query(() => User)
  @UseGuards(JwtGuard)
  async getUser(@Args('userId') userId: string) {
    const result = await this.gatewayService.sendToService(
      'user-service',
      { cmd: 'get_user' },
      { userId },
    );
    return result;
  }
}
