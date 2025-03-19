import { Injectable } from '@nestjs/common';
import Consul from 'consul';
import { getConsulConfig, ConfigService } from '@project/shared';
import { Logger } from '@nestjs/common';

// Định nghĩa interface cho response của Consul
interface ConsulServiceNode {
  ServiceMeta?: {
    queue?: string;
  };
}

@Injectable()
export class ServiceDiscovery {
  private consul: Consul;
  private readonly logger = new Logger(ServiceDiscovery.name);

  constructor(private readonly configService: ConfigService) {
    const { host, port } = getConsulConfig(configService, 'API_GATEWAY');
    this.consul = new Consul({ host, port: parseInt(port) });
  }

  async getServiceQueue(serviceName: string): Promise<string> {
    try {
      const services = (await this.consul.catalog.service.nodes(
        serviceName,
      )) as ConsulServiceNode[];
      if (!services || services.length === 0) {
        throw new Error(`Service ${serviceName} not found in Consul`);
      }

      const queue = services[0].ServiceMeta?.queue;
      if (!queue) {
        throw new Error(
          `Service ${serviceName} has no queue defined in ServiceMeta`,
        );
      }

      return queue;
    } catch (error) {
      this.logger.error(`Failed to get queue for ${serviceName}`, error);
      throw error; // Ném lỗi để GatewayService xử lý
    }
  }
}
