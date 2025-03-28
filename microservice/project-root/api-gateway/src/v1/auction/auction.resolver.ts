import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GatewayService } from '@/v1/gateway.service';
import { JwtGuard } from '@project/shared';
import { AuctionResponse } from '@/graphql/types/auction.type';

@Resolver()
export class AuctionResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => AuctionResponse)
  @UseGuards(JwtGuard)
  async createAuction(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenId') tokenId: string,
    @Args('minBid') minBid: string,
    @Args('duration') duration: number,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const auctionResult = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'create_auction' },
      { collectionId, chain, tokenId, minBid, duration, seller: user.address },
    );
    await this.gatewayService.sendToService(
      'auction-service',
      { cmd: 'create_auction' },
      {
        nft_id: tokenId,
        seller: user.address,
        starting_price: minBid,
        end_time: new Date(Date.now() + duration * 1000).toISOString(),
        chain,
      },
    );
    return auctionResult;
  }

  @Mutation(() => AuctionResponse)
  @UseGuards(JwtGuard)
  async placeBid(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenId') tokenId: string,
    @Args('bidAmount') bidAmount: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const bidResult = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'place_bid' },
      { collectionId, chain, tokenId, bidAmount, bidder: user.address },
    );
    await this.gatewayService.sendToService(
      'auction-service',
      { cmd: 'update_bid' },
      { auctionId: tokenId, bidder: user.address, current_bid: bidAmount },
    );
    return bidResult;
  }

  @Mutation(() => AuctionResponse)
  @UseGuards(JwtGuard)
  async endAuction(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenId') tokenId: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const endResult: {
      txHash: string;
    } = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'end_auction' },
      { collectionId, chain, tokenId },
    );
    const auctionData: {
      current_bid: string;
      bidder: string;
    } = await this.gatewayService.sendToService(
      'auction-service',
      { cmd: 'end_auction' },
      { auctionId: tokenId },
    );
    await this.gatewayService.sendToService(
      'transaction-service',
      { cmd: 'create_transaction' },
      {
        nft_id: tokenId,
        from_address: user.address,
        to_address: auctionData.bidder || '',
        price: auctionData.current_bid || '0',
        tx_hash: endResult.txHash,
        chain,
      },
    );
    return endResult;
  }

  @Query(() => [String])
  async getAuctionBids(@Args('auctionId') auctionId: string) {
    const result = await this.gatewayService.sendToService(
      'auction-service',
      { cmd: 'get_auction_bids' },
      { auctionId },
    );
    return result;
  }
}
