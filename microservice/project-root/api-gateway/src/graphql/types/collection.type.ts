import { ObjectType, Field, InputType } from '@nestjs/graphql';

// Type cho PublicMint (dùng cho output)
@ObjectType()
export class PublicMint {
  @Field() mintPrice: string;
  @Field() startDate: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
}

// Input type cho PublicMint (dùng cho input)
@InputType()
export class PublicMintInput {
  @Field() mintPrice: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
  @Field() startDate: string;
}

// Type cho AllowlistStage (dùng cho output)
@ObjectType()
export class AllowlistStage {
  @Field() id: string;
  @Field() mintPrice: string;
  @Field() startDate: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
  @Field(() => [String]) wallets: string[];
}

// Input type cho AllowlistStage (dùng cho input)
@InputType()
export class AllowlistStageInput {
  @Field() id: string;
  @Field() mintPrice: string;
  @Field() durationDays: string;
  @Field() durationHours: string;
  @Field(() => [String]) wallets: string[];
  @Field() startDate: string;
}

// Type cho Collection
@ObjectType()
export class Collection {
  @Field() id: string;
  @Field() name: string;
  @Field() chainId: string;
  @Field() image: string;
  @Field() mintPrice: string;
  @Field() maxSupply: string;
  @Field() mintStartDate: string;
  @Field(() => PublicMint, { nullable: true }) publicMint: PublicMint; // Sử dụng PublicMint thay vì PublicMintInput
  @Field(() => [AllowlistStage], { nullable: true })
  allowlistStages: AllowlistStage[]; // Sử dụng AllowlistStage thay vì AllowlistStageInput
  @Field() chain: string;
  @Field() createdAt: string;
  @Field() totalMinted: string;
  @Field() creatorId: string;
  @Field() isVerified: boolean;
  @Field() status: string; // "Ongoing" hoặc "Ended"
}

// Type cho Stats
@ObjectType()
export class Stats {
  @Field() artworks: number;
  @Field() artists: number;
  @Field() collectors: number;
}

// Type cho CreateCollectionStep
@ObjectType()
export class CreateCollectionStep {
  @Field() id: string;
  @Field(() => String) params: string;
}

// Type cho CreateCollectionResponse
@ObjectType()
export class CreateCollectionResponse {
  @Field({ nullable: true }) collectionId?: string;
  @Field({ nullable: true }) contractAddress?: string;
  @Field(() => [CreateCollectionStep], { nullable: true })
  steps?: CreateCollectionStep[];
}

// Type cho ApproveCollectionResponse
@ObjectType()
export class ApproveCollectionResponse {
  @Field() success: boolean;
}

// Type cho PendingCollection
@ObjectType()
export class PendingCollection {
  @Field() collectionId: string;
  @Field() name: string;
  @Field() creatorId: string;
  @Field() creatorRole: string;
  @Field() createdAt: string;
}

// Input type cho CreateCollectionInput
@InputType()
export class CreateCollectionInput {
  @Field() chain: string;
  @Field() chainId: string;
  @Field() name: string;
  @Field() description: string;
  @Field() artType: string;
  @Field() uri: string;
  @Field() collectionImageUrl: string;
  @Field() mintPrice: string;
  @Field() royaltyFee: string;
  @Field() maxSupply: string;
  @Field() mintLimit: string;
  @Field() mintStartDate: string;
  @Field(() => [AllowlistStageInput]) allowlistStages: AllowlistStageInput[];
  @Field(() => PublicMintInput) publicMint: PublicMintInput;
  @Field({ nullable: true }) contractAddress?: string;
}

// Type cho response của query getCollections
@ObjectType()
export class CollectionsResponse {
  @Field(() => [Collection]) collections: Collection[];
  @Field(() => Stats) stats: Stats;
}
