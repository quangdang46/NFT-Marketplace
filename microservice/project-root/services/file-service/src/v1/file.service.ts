import { Injectable, Logger } from '@nestjs/common';
import { getPinataConfig, ServiceClient } from '@project/shared';
import { PinataSDK } from 'pinata';
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private pinata: PinataSDK;
  constructor(private readonly serviceClient: ServiceClient) {
    this.pinata = new PinataSDK(getPinataConfig());
    this.logger.log('file Service initialized');
  }

  async getSignedUrl() {
    const url = await this.pinata.upload.public.createSignedURL({
      expires: 30,
    });
    return url;
  }
}
