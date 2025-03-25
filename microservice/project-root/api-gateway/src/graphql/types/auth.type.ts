import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field({ nullable: true })
  role?: string;


  @Field({ nullable: true })
  address?: string; // Thêm nếu auth-service trả về address
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
