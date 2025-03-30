import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class CreateCollectionResponse {
  @Field() collectionId: string;
  @Field() contractAddress: string;
}

@ObjectType()
export class ApproveCollectionResponse {
  @Field() success: boolean;
}

@ObjectType()
export class PendingCollection {
  @Field() collectionId: string;
  @Field() name: string;
  @Field() creatorId: string;
  @Field() creatorRole: string;
  @Field() createdAt: string;
}

@InputType()
export class AllowlistStageInput {
  @Field() id: string;
  @Field() mintPrice: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
  @Field(() => [String]) wallets: string[];
  @Field() startDate: string;
}

@InputType()
export class PublicMintInput {
  @Field() mintPrice: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
  @Field({ nullable: true }) startDate?: string;
}

@InputType()
export class CreateCollectionInput {
  @Field() chain: string;
  @Field() name: string;
  @Field() symbol: string;
  @Field() description: string;
  @Field() artType: string;
  @Field({ nullable: true }) metadataUrl?: string;
  @Field() collectionImageUrl: string;
  @Field({ nullable: true }) artworkUrl?: string;
  @Field() mintPrice: string;
  @Field() royaltyFee: string;
  @Field() maxSupply: string;
  @Field() mintLimit: string;
  @Field() mintStartDate: string;
  @Field(() => [AllowlistStageInput]) allowlistStages: AllowlistStageInput[];
  @Field(() => PublicMintInput) publicMint: PublicMintInput;
  @Field({ nullable: true }) contractAddress?: string;
}
