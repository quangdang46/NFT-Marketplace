import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "./shared-config.module";
import Consul = require("consul");
import { getConsulConfig } from "./index";

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

  constructor(configService: ConfigService, serviceKey: string) {
    const { host, port, serviceName } = getConsulConfig(
      configService,
      serviceKey
    );
    this.consul = new Consul({ host, port: parseInt(port) });
    this.serviceId = `${serviceName}-${process.pid}`;
  }

  async registerService(
    name: string,
    meta: Record<string, string>,
    tags: string[] = ["microservice"]
  ) {
    try {
      await this.consul.agent.service.register({
        id: this.serviceId,
        name,
        tags,
        meta,
        check: {
          ttl: "60s",
          name: `Health check for ${this.serviceId}`,
          timeout: "5s",
          deregistercriticalserviceafter: "1m",
        },
      });

      await this.consul.agent.check.pass({ id: `service:${this.serviceId}` });
      this.logger.log(
        `Service ${this.serviceId} registered and initial health check passed`
      );

      setInterval(() => {
        void (async () => {
          try {
            this.logger.log(`Passing health check for ${this.serviceId}`);
            await this.consul.agent.check.pass({
              id: `service:${this.serviceId}`,
            });
            this.logger.log(`Health check passed for ${this.serviceId}`);
          } catch (error) {
            this.logger.error(
              `Failed to pass check for ${this.serviceId}:`,
              error
            );
          }
        })();
      }, 15000);
    } catch (error) {
      this.logger.error(`Failed to register service ${name}:`, error);
      throw error;
    }
  }

  async getServiceQueue(serviceName: string): Promise<string> {
    try {
      const services = (await this.consul.catalog.service.nodes(
        serviceName
      )) as ConsulServiceNode[];
      if (!services || services.length === 0) {
        throw new Error(`Service ${serviceName} not found in Consul`);
      }
      const queue = services[0].ServiceMeta?.queue;
      if (!queue) {
        throw new Error(
          `Service ${serviceName} has no queue defined in ServiceMeta`
        );
      }
      return queue;
    } catch (error) {
      this.logger.error(`Failed to get queue for ${serviceName}:`, error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      this.logger.log(`Deregistered service ${this.serviceId} from Consul`);
    } catch (error) {
      this.logger.error(
        `Failed to deregister service ${this.serviceId}:`,
        error
      );
    }
  }
}

export default ServiceDiscovery; // Export để dùng trong shared
