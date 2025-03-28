import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard, AuthRequest } from '@project/shared';
import {
  ApproveCollectionResponse,
  CreateCollectionResponse,
} from '@/graphql/types/collection.type';

@Resolver()
export class CollectionResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => CreateCollectionResponse)
  @UseGuards(JwtGuard)
  async createCollection(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('image') image: string,
    @Args('images', { type: () => [String], nullable: true }) images: string[],
    @Args('chain') chain: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result: {
      collectionId: string;
      contractAddress: string;
    } = await this.gatewayService.sendToService(
      'collection-service',
      { cmd: 'create_collection' },
      { name, description, image, images, chain, user },
    );
    return {
      collectionId: result.collectionId,
      contractAddress: result.contractAddress,
    };
  }

  @Mutation(() => ApproveCollectionResponse)
  @UseGuards(JwtGuard)
  async approveCollection(
    @Args('collectionId') collectionId: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    const result: {
      status: string;
    } = await this.gatewayService.sendToService(
      'collection-service',
      { cmd: 'approve_collection' },
      { collectionId, user },
    );
    return { success: result.status === 'approved' };
  }
}
