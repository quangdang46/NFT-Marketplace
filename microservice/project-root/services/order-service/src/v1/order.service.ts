import { Order } from '@/entity/order.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(data: {
    nft_id: string;
    seller: string;
    price: string;
    chain: string;
  }) {
    const order = this.orderRepository.create({
      nft_id: data.nft_id,
      seller: data.seller,
      price: data.price,
      chain: data.chain,
    });
    const savedOrder = await this.orderRepository.save(order);
    this.logger.log(`Created order ${savedOrder.id}`);
    return { orderId: savedOrder.id };
  }

  async matchOrder(orderId: string, buyer: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order || order.status !== 'open')
      throw new BadRequestException('Order not found or already matched');
    order.buyer = buyer;
    order.status = 'matched';
    await this.orderRepository.save(order);
    this.logger.log(`Matched order ${orderId} with buyer ${buyer}`);
    return { success: true };
  }
}
