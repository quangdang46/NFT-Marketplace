import { NFTService } from '@/v1/nft.service';
import { Controller, Logger } from '@nestjs/common'; // Import Controller và Logger từ NestJS
import { MessagePattern, Payload } from '@nestjs/microservices'; // Import MessagePattern để xử lý tin nhắn RabbitMQ

@Controller('nft')
export class NFTController {
  private readonly logger = new Logger(NFTController.name);

  constructor(private readonly nftService: NFTService) {
    this.logger.log('NFT Controller initialized');
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
    this.logger.log('Restarting consumer for nft-service-queue');
  }
}
