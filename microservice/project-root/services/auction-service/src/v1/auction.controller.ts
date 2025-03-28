import { AuctionService } from '@/v1/autction.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auction')
export class AuctionController {
  private readonly logger = new Logger(AuctionController.name);

  constructor(private readonly auctionService: AuctionService) {
    this.logger.log('auction Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for auction-service-queue');
  }

  @MessagePattern({ cmd: 'create_auction' })
  async createAuction(
    @Payload()
    data: {
      nft_id: string;
      seller: string;
      starting_price: string;
      end_time: string;
      chain: string;
    },
  ) {
    this.logger.log(`Received create_auction request for NFT ${data.nft_id}`);
    return this.auctionService.createAuction(data);
  }

  @MessagePattern({ cmd: 'update_bid' })
  async updateBid(
    @Payload() data: { auctionId: string; bidder: string; current_bid: string },
  ) {
    this.logger.log(
      `Received update_bid request for auction ${data.auctionId}`,
    );
    return this.auctionService.updateBid(data);
  }

  @MessagePattern({ cmd: 'end_auction' })
  async endAuction(@Payload() data: { auctionId: string }) {
    this.logger.log(
      `Received end_auction request for auction ${data.auctionId}`,
    );
    return this.auctionService.endAuction(data.auctionId);
  }

  @MessagePattern({ cmd: 'get_auction_bids' })
  async getAuctionBids(@Payload() data: { auctionId: string }) {
    this.logger.log(
      `Received get_auction_bids request for auction ${data.auctionId}`,
    );
    return this.auctionService.getAuctionBids(data.auctionId);
  }
}
