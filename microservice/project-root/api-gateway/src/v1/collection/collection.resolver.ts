import { Resolver, Mutation, Args, Context, Query, Subscription } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { Inject, UseGuards } from '@nestjs/common';
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
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class CollectionResolver {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('PUB_SUB') private readonly pubSub: RedisPubSub,
  ) {}

  // Mutation: Create a collection with real-time notification
  @Mutation(() => CreateCollectionResponse)
  @UseGuards(JwtGuard)
  async createCollection(
    @Args('input') input: CreateCollectionInput,
    @Context() context: { req: any },
  ): Promise<CreateCollectionResponse> {
    const user = context.req.user;
    console.log('Input received:', input);

    try {
      const processedPublicMint = {
        ...input.publicMint,
        startDate: input.publicMint.startDate || new Date().toISOString(), // Giá trị mặc định nếu rỗng
      };
      const result: {
        collectionId?: string;
        contractAddress?: string;
        steps?: { id: string; params: any }[];
      } = await this.gatewayService.sendToService(
        'collection-service',
        { cmd: 'create_collection' },
        {
          ...input,
          publicMint: processedPublicMint,
          user: { id: user.id, role: user.role },
        },
      );

      // Real-time: Publish event when a new collection is created
      if (result.collectionId) {
        const newCollection: Collection = {
          id: result.collectionId,
          name: input.name,
          chainId: input.chainId,
          image: input.collectionImageUrl,
          mintPrice: input.mintPrice,
          maxSupply: input.maxSupply,
          mintStartDate: input.mintStartDate,
          chain: input.chain,
          createdAt: new Date().toISOString(),
          totalMinted: '0',
          creatorId: user.id,
          isVerified: false,
          status: 'pending',
          allowlistStages: input.allowlistStages,
          publicMint: processedPublicMint,
        };

        // Gửi thông báo real-time qua subscription
        await this.pubSub.publish('COLLECTION_CREATED', {
          collectionCreated: newCollection,
        });
      }

      return {
        collectionId: result.collectionId,
        contractAddress: result.contractAddress,
        steps: result.steps,
      };
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection');
    }
  }

  // Mutation: Approve a collection with real-time notification
  @Mutation(() => ApproveCollectionResponse)
  @UseGuards(JwtGuard)
  async approveCollection(
    @Args('collectionId') collectionId: string,
    @Context() context: { req: any },
  ): Promise<ApproveCollectionResponse> {
    const user = context.req.user;
    if (user.role !== 'admin') {
      throw new Error('Only admins can approve collections');
    }

    try {
      const result: { status: 'approved' | 'failed'; collection?: Collection } =
        await this.gatewayService.sendToService(
          'collection-service',
          { cmd: 'approve_collection' },
          { collectionId, user: { id: user.id, role: user.role } },
        );

      // Real-time: Publish event when a collection is approved
      if (result.status === 'approved' && result.collection) {
        await this.pubSub.publish('COLLECTION_APPROVED', {
          collectionApproved: { ...result.collection, status: 'approved' },
        });
      }

      return { success: result.status === 'approved' };
    } catch (error) {
      console.error('Error approving collection:', error);
      throw new Error('Failed to approve collection');
    }
  }

  // Query: Get pending collections (no real-time needed here, but admin-only)
  @Query(() => [PendingCollection])
  @UseGuards(JwtGuard)
  async getPendingCollections(
    @Context() context: { req: any },
  ): Promise<PendingCollection[]> {
    const user = context.req.user;
    if (user.role !== 'admin') {
      throw new Error('Only admins can view pending collections');
    }

    try {
      const result: { collections: PendingCollection[] } =
        await this.gatewayService.sendToService(
          'collection-service',
          { cmd: 'get_pending_collections' },
          {},
        );
      return result.collections || [];
    } catch (error) {
      console.error('Error fetching pending collections:', error);
      throw new Error('Failed to fetch pending collections');
    }
  }

  // Query: Get collections and stats (with real-time subscription support)
  @Query(() => CollectionsResponse)
  async getCollections(
    @Args('chainId', { nullable: true }) chainId?: string,
  ): Promise<CollectionsResponse> {
    console.log('Chain received:', chainId);

    try {
      const result: { collections: Collection[]; stats: Stats } =
        await this.gatewayService.sendToService(
          'collection-service',
          { cmd: 'get_collections' },
          { chainId },
        );
      return {
        collections: result.collections || [],
        stats: result.stats || { artworks: 0, artists: 0, collectors: 0 },
      };
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections');
    }
  }

  // Subscription: Real-time notification for new collections
  @Subscription(() => Collection, {
    resolve: (payload) => payload.collectionCreated,
    // Optional: Filter by chainId if the client specifies it
    filter: (payload, variables) => {
      return variables.chainId
        ? payload.collectionCreated.chainId === variables.chainId
        : true;
    },
  })
  collectionCreated(@Args('chainId', { nullable: true }) chainId?: string) {
    return this.pubSub.asyncIterator('COLLECTION_CREATED');
  }

  // Subscription: Real-time notification for approved collections
  @Subscription(() => Collection, {
    resolve: (payload) => payload.collectionApproved,
    filter: (payload, variables) => {
      return variables.chainId
        ? payload.collectionApproved.chainId === variables.chainId
        : true;
    },
  })
  collectionApproved(@Args('chainId', { nullable: true }) chainId?: string) {
    return this.pubSub.asyncIterator('COLLECTION_APPROVED');
  }

  // Additional Subscription: Real-time updates for stats (if needed)
  @Subscription(() => Stats, {
    resolve: (payload) => payload.statsUpdated,
  })
  statsUpdated() {
    return this.pubSub.asyncIterator('STATS_UPDATED');
  }
}
