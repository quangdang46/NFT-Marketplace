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
  async createCollection(data: any) {
    try {
      const result = await this.collectionService.createCollection(data);
      return result;
    } catch (error) {
      console.log(error);
      throw error; // Đảm bảo lỗi được truyền lại qua RabbitMQ
    }
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

  // Thêm message pattern để lấy collections và stats
  @MessagePattern({ cmd: 'get_collections' })
  async getCollections(data: { chainId?: string }) {
    const collections = await this.collectionService.getCollections(
      data.chainId,
    );
    const stats = await this.collectionService.getStats(data.chainId);
    return { collections, stats };
  }
}
