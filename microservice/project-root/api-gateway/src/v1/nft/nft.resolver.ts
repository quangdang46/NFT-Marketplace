import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard, AuthRequest } from '@project/shared';
import { MarketplaceNFTsResponse, MintResponse } from '@/graphql/types/nft.type';

@Resolver()
export class NftResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => MintResponse)
  @UseGuards(JwtGuard)
  async bulkMintManual(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenURIs', { type: () => [String] }) tokenURIs: string[],
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'bulk_mint_manual' },
      { collectionId, wallet_address: user.address, chain, tokenURIs },
    );
    return result;
  }

  @Mutation(() => MintResponse)
  @UseGuards(JwtGuard)
  async mintManual(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenURI') tokenURI: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'mint_manual' },
      { collectionId, wallet_address: user.address, chain, tokenURI },
    );
    return result;
  }

  @Mutation(() => MintResponse)
  @UseGuards(JwtGuard)
  async lazyMintManual(
    @Args('collectionId') collectionId: string,
    @Args('chain') chain: string,
    @Args('tokenURI') tokenURI: string,
    @Args('royaltyPercentage') royaltyPercentage: number,
    @Args('signature') signature: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'lazy_mint_manual' },
      {
        collectionId,
        wallet_address: user.address,
        chain,
        tokenURI,
        royaltyPercentage,
        signature,
      },
    );
    return result;
  }

  @Query(() => MarketplaceNFTsResponse)
  async getMarketplaceNFTs(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ) {
    const result = await this.gatewayService.sendToService(
      'nft-service',
      { cmd: 'get_marketplace_nfts' },
      { page, limit },
    );
    return result;
  }
}
