// v1/test.controller.ts
import { TestService } from '@/v1/test.service';
import { Controller, Logger } from '@nestjs/common'; // Import Controller và Logger từ NestJS
import { MessagePattern, Payload } from '@nestjs/microservices'; // Import MessagePattern để xử lý tin nhắn RabbitMQ

@Controller('test') // Định nghĩa controller với path và version
export class TestController {
  private readonly logger = new Logger(TestController.name); // Tạo logger cho controller

  constructor(private readonly testService: TestService) {
    this.logger.log('Test Controller initialized'); // Ghi log khi controller khởi tạo
  }

  // Xử lý tin nhắn ping
  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong'; // Trả về "pong" để xác nhận
  }

  // Xử lý tin nhắn restart (nếu cần)
  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for test-service-queue');
    // Logic để đăng ký lại consumer nếu cần
  }

  // Xử lý tin nhắn get_test
  @MessagePattern({ cmd: 'get_test' })
  async createOrFindTestRecord(@Payload() data: { name: string }) {
    this.logger.log(`Received get_test message with name: ${data.name}`);
  }
}
