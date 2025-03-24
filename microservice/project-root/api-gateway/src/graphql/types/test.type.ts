import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Test {
  @Field()
  message: string;
}
