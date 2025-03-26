import { UserService } from '@/v1/user.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller({ path: 'user', version: '1' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('User Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern({ cmd: 'get_user' })
  async findOrCreateUser(@Payload() data: { address: string }) {
    return this.userService.findOrCreateUser(data.address);
  }
}
