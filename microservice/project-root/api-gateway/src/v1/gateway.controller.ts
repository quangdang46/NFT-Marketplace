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
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for api-gateway-queue');
    // Logic để đăng ký lại consumer nếu cần
  }
}
