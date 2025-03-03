import { Module } from '@nestjs/common';
import { UserV1Service } from './v1/user.service';
import { UserV1Resolver } from './v1/user.resolver';
import { UserV1Controller } from 'src/user/v1/user.controller';

@Module({
  providers: [UserV1Resolver, UserV1Service],
  controllers: [UserV1Controller],
})
export class UserModule {}
