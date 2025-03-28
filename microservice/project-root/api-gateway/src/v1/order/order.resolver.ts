import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GatewayService } from '@/v1/gateway.service';
import { JwtGuard } from '@project/shared';
import {
  CreateOrderResponse,
  MatchOrderResponse,
} from '@/graphql/types/order.type';

@Resolver()
export class OrderResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => CreateOrderResponse)
  @UseGuards(JwtGuard)
  async createOrder(
    @Args('nft_id') nft_id: string,
    @Args('price') price: string,
    @Args('chain') chain: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result: {
      orderId: string;
    } = await this.gatewayService.sendToService(
      'order-service',
      { cmd: 'create_order' },
      { nft_id, seller: user.address, price, chain },
    );
    return { orderId: result.orderId };
  }

  @Mutation(() => MatchOrderResponse)
  @UseGuards(JwtGuard)
  async matchOrder(
    @Args('orderId') orderId: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result: {
      success: boolean;
    } = await this.gatewayService.sendToService(
      'order-service',
      { cmd: 'match_order' },
      { orderId, buyer: user.address },
    );
    return { success: result.success };
  }
}
