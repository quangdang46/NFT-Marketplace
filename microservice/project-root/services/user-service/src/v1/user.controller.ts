import { UserService } from '@/v1/user.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'find_or_create_user' })
  async findOrCreateUser(@Payload() data: { address: string }) {
    return this.userService.findOrCreateUser(data.address);
  }
}
