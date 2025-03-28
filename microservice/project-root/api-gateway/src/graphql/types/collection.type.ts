import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Collection {
  @Field()
  id: string;

  @Field()
  contractAddress: string;
}

@ObjectType()
export class CreateCollectionResponse {
  @Field()
  collectionId: string;

  @Field()
  contractAddress: string;
}

@ObjectType()
export class ApproveCollectionResponse {
  @Field()
  success: boolean;
}
