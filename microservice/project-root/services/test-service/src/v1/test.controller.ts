import { TestService } from '@/v1/test.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('test')
export class TestController {
  private readonly logger = new Logger(TestController.name);

  constructor(private readonly testService: TestService) {
    this.logger.log('Test Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for test-service-queue');
  }
}
