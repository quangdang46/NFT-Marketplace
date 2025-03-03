import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'user', version: '1' })
export class UserV1Controller {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
