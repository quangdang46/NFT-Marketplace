import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { getConsulConfig, ConfigService } from '@project/shared';
import { Logger } from '@nestjs/common';
import Consul from 'consul';


interface ConsulServiceNode {
  ServiceMeta?: {
    queue?: string;
  };
}

@Injectable()
export class ServiceDiscovery implements OnApplicationShutdown {
  private consul: Consul;
  private readonly logger = new Logger(ServiceDiscovery.name);
  private serviceId: string;

  constructor(private readonly configService: ConfigService) {
    const { host, port, serviceName } = getConsulConfig(
      configService,
      'API_GATEWAY',
    );
    this.consul = new Consul({ host, port: parseInt(port) });
    this.serviceId = `${serviceName}-${process.pid}`;
  }

  async onApplicationShutdown() {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      this.logger.log(`Deregistered service ${this.serviceId} from Consul`);
    } catch (error) {
      this.logger.error(
        `Failed to deregister service ${this.serviceId}:`,
        error,
      );
    }
  }

  async registerService(meta: Record<string, string>) {
    try {
      const { serviceName } = getConsulConfig(
        this.configService,
        'API_GATEWAY',
      );
      await this.consul.agent.service.register({
        id: this.serviceId,
        name: serviceName,
        tags: ['api-gateway', 'rabbitmq'],
        meta,
        check: {
          ttl: '15s',
          name: `Health check for ${this.serviceId}`,
          timeout: '5s',
        },
      });

      // Set up periodic health check updates
      setInterval(() => {
        void (async () => {
          try {
            await this.consul.agent.check.pass({
              id: `service:${this.serviceId}`,
            });
          } catch (error) {
            this.logger.error(
              `Failed to pass health check for ${this.serviceId}:`,
              error,
            );
          }
        })();
      }, 10000);

      this.logger.log(`Registered service ${serviceName} with Consul`);
    } catch (error) {
      this.logger.error('Failed to register service with Consul:', error);
      throw error;
    }
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
      this.logger.error(`Failed to get queue for ${serviceName}:`, error);
      throw error;
    }
  }
}
