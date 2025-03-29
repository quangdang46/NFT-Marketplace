import { FileService } from '@/v1/file.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private readonly fileService: FileService) {
    this.logger.log('file Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for file-service-queue');
  }

  @MessagePattern({ cmd: 'get-signed-url' })
  async getPreSignedUrl() {
    const url =await this.fileService.getSignedUrl();
    return url;
  }
}
