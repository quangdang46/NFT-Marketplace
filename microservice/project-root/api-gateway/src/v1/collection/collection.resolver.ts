import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '@project/shared';
import {
  CreateCollectionResponse,
  ApproveCollectionResponse,
  PendingCollection,
  CreateCollectionInput,
  CollectionsResponse,
  Collection,
  Stats,
} from '@/graphql/types/collection.type';

@Resolver()
export class CollectionResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Mutation(() => CreateCollectionResponse)
  @UseGuards(JwtGuard)
  async createCollection(
    @Args('input') input: CreateCollectionInput,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    console.log('Input received:', input);
    const result: {
      collectionId?: string;
      contractAddress?: string;
      steps?: { id: string; params: any }[];
    } = await this.gatewayService.sendToService(
      'collection-service',
      { cmd: 'create_collection' },
      {
        ...input,
        user: { id: user.id, role: user.role },
      },
    );
    return {
      collectionId: result.collectionId,
      contractAddress: result.contractAddress,
      steps: result.steps,
    };
  }

  @Mutation(() => ApproveCollectionResponse)
  @UseGuards(JwtGuard)
  async approveCollection(
    @Args('collectionId') collectionId: string,
    @Context() context: { req: any },
  ) {
    const user = context.req.user;
    if (user.role !== 'admin')
      throw new Error('Only admins can approve collections');
    const result: { status: 'approved' | 'failed' } =
      await this.gatewayService.sendToService(
        'collection-service',
        { cmd: 'approve_collection' },
        { collectionId, user: { id: user.id, role: user.role } },
      );
    return { success: result.status === 'approved' };
  }

  @Query(() => [PendingCollection])
  @UseGuards(JwtGuard)
  async getPendingCollections(@Context() context: { req: any }) {
    const user = context.req.user;
    if (user.role !== 'admin')
      throw new Error('Only admins can view pending collections');
    const result: { collections: PendingCollection[] } =
      await this.gatewayService.sendToService(
        'collection-service',
        { cmd: 'get_pending_collections' },
        {},
      );
    return result.collections;
  }

  // Thêm query để lấy collections và stats
  @Query(() => CollectionsResponse)
  async getCollections(@Args('chainId', { nullable: true }) chainId?: string) {
    console.log('Chain received:', chainId);
    const result: { collections: Collection[]; stats: Stats } =
      await this.gatewayService.sendToService(
        'collection-service',
        { cmd: 'get_collections' },
        { chainId },
      );
    return result;
  }
}
