import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateNFTDto {
  @Field()
  name: string;
}
