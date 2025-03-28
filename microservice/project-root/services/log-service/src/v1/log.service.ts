import { Log } from '@/entity/log.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  async createLog(data: { user_id: string; action: string }) {
    const log = this.logRepository.create({
      user_id: data.user_id,
      action: data.action,
    });
    const savedLog = await this.logRepository.save(log);
    this.logger.log(`Created log ${savedLog.id} for user ${data.user_id}`);
    return { logId: savedLog.id };
  }
}
