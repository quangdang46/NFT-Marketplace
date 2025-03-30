import { Metadata } from '@/types/nft.type';
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
    return 'pong'; // Trả về "pong" để xác nhận
  }

  // Xử lý tin nhắn restart (nếu cần)
  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for nft-service-queue');
  }

  @MessagePattern({ cmd: 'bulk_mint_manual' })
  async bulkMintManual(
    @Payload()
    data: {
      collectionId: string;
      wallet_address: string;
      chain: 'eth-sepolia' | 'base-sepolia' | 'polygon-mumbai';
      tokenURIs: string[];
      user: { id: number; address: string; role?: string };
    },
  ) {
    this.logger.log(
      `Received bulk_mint_manual request for collection ${data.collectionId}`,
    );
    this.logger.log(
      `User: id=${data.user.id}, address=${data.user.address}, role=${data.user.role || 'USER'}`,
    );

    return this.nftService.bulkMintManual({
      collectionId: data.collectionId,
      wallet_address: data.user.address,
      chain: data.chain,
      tokenURIs: data.tokenURIs,
    });
  }
}
