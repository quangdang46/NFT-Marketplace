import { UserService } from '@/v1/user.service';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller({ path: 'user', version: '1' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'ping' })
  async handlePing(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<string> {
    this.logger.log('Received ping message');
    const response = 'pong';
    this.logger.log('Sent pong response');
    return response;
  }

  @MessagePattern({ cmd: 'get_user' })
  async findOrCreateUser(@Payload() data: { address: string }) {
    return this.userService.findOrCreateUser(data.address);
  }
}
