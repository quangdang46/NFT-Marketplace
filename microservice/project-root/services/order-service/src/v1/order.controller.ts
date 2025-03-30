import { OrderService } from '@/v1/order.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {
    this.logger.log('order Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for order-service-queue');
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(
    @Payload()
    data: {
      nft_id: string;
      seller: string;
      price: string;
      chain: string;
    },
  ) {
    this.logger.log(`Received create_order request for NFT ${data.nft_id}`);
    return this.orderService.createOrder(data);
  }

  @MessagePattern({ cmd: 'match_order' })
  async matchOrder(@Payload() data: { orderId: string; buyer: string }) {
    this.logger.log(`Received match_order request for order ${data.orderId}`);
    return this.orderService.matchOrder(data.orderId, data.buyer);
  }
}
