import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NFT {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  tokenURI: string;

  @Field()
  owner: string;
}

@ObjectType()
export class MintResponse {
  @Field()
  txHash: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field(() => [String], { nullable: true })
  tokenIds?: string[];

  @Field()
  success: boolean;
}

@ObjectType()
export class MarketplaceNFTsResponse {
  @Field(() => [NFT])
  nfts: NFT[];
}
