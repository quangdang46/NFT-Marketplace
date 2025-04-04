import { UserService } from '@/v1/user.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('User Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for api-gateway-queue');
    // Logic để đăng ký lại consumer nếu cần
  }

  @MessagePattern({ cmd: 'get_user' })
  async findOrCreateUser(@Payload() data: { address: string }) {
    return this.userService.findOrCreateUser(data.address);
  }

  @MessagePattern({ cmd: 'verify_user' })
  async verifyUser(@Payload() data: { userId: string }) {
    this.logger.log(`Received verify_user request for ${data.userId}`);
    return this.userService.verifyUser(data.userId);
  }
}
