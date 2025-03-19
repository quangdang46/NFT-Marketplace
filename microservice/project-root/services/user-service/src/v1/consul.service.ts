import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import Consul from 'consul'; // Import default
import { getConsulConfig,ConfigService } from '@project/shared';

@Injectable()
export class ConsulService implements OnApplicationShutdown {
  private consul: Consul;
  private serviceId: string;

  constructor(configService: ConfigService) {
    const { host, port, serviceName } = getConsulConfig(configService, 'USER');
    this.consul = new Consul({ host, port: parseInt(port) }); // Consul là constructor
    this.serviceId = `${serviceName}-${process.pid}`;
  }

  async registerService(name: string, meta: Record<string, string>) {
    try {
      await this.consul.agent.service.register({
        id: this.serviceId,
        name,
        tags: ['microservice', 'rabbitmq'],
        meta,
        check: {
          ttl: '15s',
          name: `Health check for ${this.serviceId}`,
          timeout: '5s',
        },
      });

      setInterval(() => {
        void (async () => {
          try {
            await this.consul.agent.check.pass({
              id: `service:${this.serviceId}`,
            });
          } catch (error) {
            console.error(`Failed to pass check for ${this.serviceId}:`, error);
          }
        })();
      }, 10000);
    } catch (error) {
      console.error(`Failed to register service ${name}:`, error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
    } catch (error) {
      console.error(`Failed to deregister service ${this.serviceId}:`, error);
    }
  }
}
