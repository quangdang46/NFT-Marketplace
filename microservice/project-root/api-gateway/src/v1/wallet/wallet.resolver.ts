import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GatewayService } from '@/v1/gateway.service';
import { JwtGuard } from '@project/shared';
import { AddWalletResponse, Wallet } from '@/graphql/types/wallet.type';

@Resolver()
export class WalletResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => AddWalletResponse)
  @UseGuards(JwtGuard)
  async addWallet(
    @Args('address') address: string,
    @Args('chain') chain: string,
    @Args('is_primary', { nullable: true }) is_primary: boolean,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result: {
      walletId: string;
    } = await this.gatewayService.sendToService(
      'wallet-service',
      { cmd: 'add_wallet' },
      { user_id: user.id, address, chain, is_primary },
    );
    return { walletId: result.walletId };
  }

  @Query(() => [Wallet])
  @UseGuards(JwtGuard)
  async getWallets(@Context() context: { req: any }) {
    const user = context.req.user;
    const result = await this.gatewayService.sendToService(
      'wallet-service',
      { cmd: 'get_wallets' },
      { userId: user.id },
    );
    return result;
  }
}
