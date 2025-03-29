import { Resolver, Query, Context } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@project/shared';

@Resolver()
export class FileResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Query(() => String)
  //   @UseGuards(JwtGuard)
  async getSignedUrl() {
    return this.gatewayService.sendToService(
      'file-service',
      { cmd: 'get-signed-url' },
      {},
    );
  }
}
