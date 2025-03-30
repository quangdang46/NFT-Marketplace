import { SettingsService } from '@/v1/settings.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private readonly settingsService: SettingsService) {
    this.logger.log('settings Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for settings-service-queue');
  }

  @MessagePattern({ cmd: 'set_setting' })
  async setSetting(@Payload() data: { key: string; value: string }) {
    this.logger.log(`Received set_setting request for ${data.key}`);
    return this.settingsService.setSetting(data);
  }

  @MessagePattern({ cmd: 'get_setting' })
  async getSetting(@Payload() data: { key: string }) {
    this.logger.log(`Received get_setting request for ${data.key}`);
    return this.settingsService.getSetting(data.key);
  }
}
