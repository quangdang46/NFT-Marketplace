// v1/collection.controller.ts
import { CollectionService } from '@/v1/collection.service';
import { Controller, Logger } from '@nestjs/common'; // Import Controller và Logger từ NestJS
import { MessagePattern, Payload } from '@nestjs/microservices'; // Import MessagePattern để xử lý tin nhắn RabbitMQ

@Controller('collection') // Định nghĩa controller với path và version
export class CollectionController {
  private readonly logger = new Logger(CollectionController.name); // Tạo logger cho controller

  constructor(private readonly collectionService: CollectionService) {
    this.logger.log('Collection Controller initialized'); // Ghi log khi controller khởi tạo
  }

  // Xử lý tin nhắn ping
  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong'; // Trả về "pong" để xác nhận
  }

  // Xử lý tin nhắn restart (nếu cần)
  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for collection-service-queue');
    // Logic để đăng ký lại consumer nếu cần
  }

  @MessagePattern({ cmd: 'create_collection' })
  async createCollection(
    @Payload()
    data: {
      name: string;
      description: string;
      image: string;
      images: string[];
      chain: string;
      user: { id: number; address: string; role?: string };
    },
  ) {
    this.logger.log(`Received create_collection request for ${data.name}`);
    return this.collectionService.createCollection(data);
  }

  @MessagePattern({ cmd: 'approve_collection' })
  async approveCollection(
    @Payload()
    data: {
      collectionId: string;
      user: { id: number; address: string; role?: string };
    },
  ) {
    this.logger.log(
      `Received approve_collection request for ${data.collectionId}`,
    );
    return this.collectionService.approveCollection(data);
  }

  @MessagePattern({ cmd: 'get_collection' })
  async getCollection(@Payload() data: { collectionId: string }) {
    this.logger.log(`Received get_collection request for ${data.collectionId}`);
    return this.collectionService.getCollection(data.collectionId);
  }

  @MessagePattern({ cmd: 'update_nft_count' })
  async updateNftCount(
    @Payload() data: { collectionId: string; count: number },
  ) {
    this.logger.log(
      `Received update_nft_count request for ${data.collectionId}`,
    );
    return this.collectionService.updateNftCount(data.collectionId, data.count);
  }
}
