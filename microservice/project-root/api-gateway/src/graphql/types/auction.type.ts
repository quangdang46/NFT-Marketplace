import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuctionResponse {
  @Field()
  txHash: string;

  @Field()
  success: boolean;
}
