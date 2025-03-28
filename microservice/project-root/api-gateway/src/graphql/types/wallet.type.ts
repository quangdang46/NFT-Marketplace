import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Wallet {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  chain: string;

  @Field()
  is_primary: boolean;
}

@ObjectType()
export class AddWalletResponse {
  @Field()
  walletId: string;
}
