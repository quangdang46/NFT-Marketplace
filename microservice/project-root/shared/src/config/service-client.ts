import { Injectable, Inject } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { RabbitMQClient } from "./rabbitmq.client";
import { ServiceDiscovery } from "./service-discovery";
import { Transport } from "@nestjs/microservices";

@Injectable()
export class ServiceClient {
  private readonly logger = new Logger(ServiceClient.name);
  private clients: Record<string, RabbitMQClient> = {};

  constructor(
    @Inject("RABBITMQ_OPTIONS") private readonly rmqOptions: any,
    private readonly serviceDiscovery: ServiceDiscovery,
    private readonly initialServices: string[] = []
  ) {
    this.initializeClients();
  }

  private async initializeClients() {
    for (const service of this.initialServices) {
      const queue = await this.serviceDiscovery.getServiceQueue(service);
      this.clients[service] = new RabbitMQClient({
        transport: Transport.RMQ,
        options: { ...this.rmqOptions.options, queue },
      });
      this.logger.log(`Initialized client for ${service} with queue: ${queue}`);
    }
  }

  async sendToService<T>(service: string, pattern: any, data: any): Promise<T> {
    let client = this.clients[service];
    if (!client) {
      const queue = await this.serviceDiscovery.getServiceQueue(service);
      this.logger.log(`Resolved queue for ${service}: ${queue}`);
      client = new RabbitMQClient({
        transport: Transport.RMQ,
        options: { ...this.rmqOptions.options, queue },
      });
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
      const result = await Promise.race([
        client.send<T>(pattern, data),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000)
        ),
      ]);
      this.logger.log(`Received from ${service}: ${JSON.stringify(result)}`);
      return result as T;
    } catch (error) {
      this.logger.error(`Failed to send to ${service}: ${error.message}`);
      throw new Error(`Service ${service} unavailable: ${error.message}`);
    }
  }
}
