import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  role: string;

  @Field()
  email: string;

  @Field()
  wallet_address: string;

  @Field()
  is_verified: boolean;
}

@ObjectType()
export class CreateUserResponse {
  @Field()
  userId: string;
}

@ObjectType()
export class VerifyUserResponse {
  @Field()
  status: string;
}
