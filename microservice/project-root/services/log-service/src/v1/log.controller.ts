import { LogService } from '@/v1/log.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('log')
export class LogController {
  private readonly logger = new Logger(LogController.name);

  constructor(private readonly logService: LogService) {
    this.logger.log('log Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for log-service-queue');
  }

  @MessagePattern({ cmd: 'create_log' })
  async createLog(@Payload() data: { user_id: string; action: string }) {
    this.logger.log(`Received create_log request for user ${data.user_id}`);
    return this.logService.createLog(data);
  }
}
