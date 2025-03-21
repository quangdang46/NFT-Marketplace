import { Injectable, Inject } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { RabbitMQClient } from "./rabbitmq.client";
import { ServiceDiscovery } from "./service-discovery";

@Injectable()
export class ServiceClient {
  private readonly logger = new Logger(ServiceClient.name);
  private clients: Record<string, RabbitMQClient> = {};

  constructor(
    @Inject("RABBITMQ_OPTIONS") private readonly rmqOptions: any,
    private readonly serviceDiscovery: ServiceDiscovery,
    private readonly initialServices: string[] = [] // Danh sách service khởi tạo ban đầu
  ) {
    this.initializeClients();
  }

  private async initializeClients() {
    for (const service of this.initialServices) {
      try {
        const queue = await this.serviceDiscovery.getServiceQueue(service);
        this.clients[service] = new RabbitMQClient({
          ...this.rmqOptions,
          queue,
        });
        this.logger.log(
          `Initialized client for ${service} with queue: ${queue}`
        );
      } catch (error) {
        this.logger.error(`Failed to initialize client for ${service}`, error);
      }
    }
  }

  async sendToService<T>(service: string, pattern: any, data: any): Promise<T> {
    let client = this.clients[service];
    if (!client) {
      const queue = await this.serviceDiscovery.getServiceQueue(service);
      client = new RabbitMQClient({ ...this.rmqOptions, queue });
      this.clients[service] = client;
      this.logger.log(
        `Dynamically added client for ${service} with queue: ${queue}`
      );
    }
    try {
      this.logger.log(
        `Sending to ${service}: ${JSON.stringify(pattern)} - ${JSON.stringify(
          data
        )}`
      );
      const result = await client.send<T>(pattern, data);
      this.logger.log(`Received from ${service}: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send to ${service}`, error);
      throw new Error(`Service ${service} unavailable`);
    }
  }
}
