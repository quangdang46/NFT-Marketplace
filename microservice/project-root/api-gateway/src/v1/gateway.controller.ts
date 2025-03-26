import { Controller, Logger } from '@nestjs/common';
import { ServiceClient } from '@project/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor() {
    this.logger.log('GatewayController initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  async handlePing(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<string> {
    this.logger.log('Received ping message, responding with pong...');
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return 'pong';
  }
}
