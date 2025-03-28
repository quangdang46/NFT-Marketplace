import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateOrderResponse {
  @Field()
  orderId: string;
}

@ObjectType()
export class MatchOrderResponse {
  @Field()
  success: boolean;
}
