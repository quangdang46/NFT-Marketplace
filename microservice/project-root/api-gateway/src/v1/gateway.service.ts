import { Injectable } from '@nestjs/common';
import {
  ServiceClient,
} from '@project/shared';

@Injectable()
export class GatewayService {
  constructor(private readonly serviceClient: ServiceClient) {}

  async sendToService<T>(service: string, pattern: any, data: any): Promise<T> {
    return this.serviceClient.sendToService(service, pattern, data);
  }

}
