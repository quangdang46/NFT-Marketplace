import { CollectionService } from '@/v1/collection.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('collection')
export class CollectionController {
  private readonly logger = new Logger(CollectionController.name);

  constructor(private readonly collectionService: CollectionService) {
    this.logger.log('Collection Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern({ cmd: 'create_collection' })
  async createCollection(data: {
    chain: string;
    name: string;
    symbol: string;
    description: string;
    artType: string;
    uri?: string; // Giữ uri
    collectionImageUrl: string;
    artworkUrl?: string;
    mintPrice: string;
    royaltyFee: string;
    maxSupply: string;
    mintLimit: string;
    mintStartDate: string;
    allowlistStages: any[];
    publicMint: any;
    contractAddress?: string;
    user: { id: string; role: string };
  }) {
    return this.collectionService.createCollection(data);
  }

  @MessagePattern({ cmd: 'approve_collection' })
  async approveCollection(data: {
    collectionId: string;
    user: { id: string; role: string };
  }) {
    if (data.user.role !== 'admin')
      throw new Error('Only admins can approve collections');
    const result = await this.collectionService.approveCollection(
      data.collectionId,
    );
    return { status: result ? 'approved' : 'failed' };
  }

  @MessagePattern({ cmd: 'get_pending_collections' })
  async getPendingCollections() {
    const collections = await this.collectionService.getPendingCollections();
    return { collections };
  }
}
