import { Setting } from '@/entity/setting.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import Redis from 'ioredis';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async setSetting(data: { key: string; value: string }) {
    const setting = await this.settingRepository.findOne({
      where: { key: data.key },
    });
    if (setting) {
      setting.value = data.value;
      await this.settingRepository.save(setting);
    } else {
      const newSetting = this.settingRepository.create(data);
      await this.settingRepository.save(newSetting);
    }
    await this.redis.del('settings:fees'); // Xóa cache khi cập nhật
    this.logger.log(`Set setting ${data.key} to ${data.value}`);
    return { success: true };
  }

  async getSetting(key: string) {
    const cacheKey = 'settings:fees';
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      const settings = JSON.parse(cached);
      if (settings[key]) return { key, value: settings[key] };
    }

    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) return null;

    const allSettings = await this.settingRepository.find();
    const settingsMap = allSettings.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }),
      {},
    );
    await this.redis.set(cacheKey, JSON.stringify(settingsMap), 'EX', 3600); // 1 giờ
    return { key: setting.key, value: setting.value };
  }
}
