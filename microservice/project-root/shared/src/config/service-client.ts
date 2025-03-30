import { Injectable, Inject } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { RabbitMQClient } from "./rabbitmq.client";
import { ServiceDiscovery } from "./service-discovery";

@Injectable()
export class ServiceClient {
  private readonly logger = new Logger(ServiceClient.name);
  private clients: Record<string, RabbitMQClient> = {};

  constructor(
    private readonly serviceDiscovery: ServiceDiscovery,
    private readonly initialServices: string[] = []
  ) {
    this.initializeClients();
  }

  private async initializeClients() {
    for (const service of this.initialServices) {
      const queue = await this.serviceDiscovery.getServiceQueue(service);
      this.clients[service] = new RabbitMQClient(service);
      // this.logger.log(`Initialized client for ${service} with queue: ${queue}`);
    }
  }

  async sendToService<T>(
    service: string,
    pattern: any,
    data: any,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let client = this.clients[service];
    if (!client) {
      const queue = await this.serviceDiscovery.getServiceQueue(service);
      client = new RabbitMQClient(service);
      this.clients[service] = client;
      // this.logger.log(
      //   `Dynamically added client for ${service} with queue: ${queue}`
      // );
    }

    let attempt = 0;
    while (attempt < retries) {
      try {
        if (!client.getConnectionStatus()) {
          throw new Error("RabbitMQ not connected");
        }
        this.logger.log(
          `Sending to ${service} (attempt ${attempt + 1}): ${JSON.stringify(
            pattern
          )} - ${JSON.stringify(data)}`
        );
        const result = await Promise.race([
          client.send<T>(pattern, data),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          ),
        ]);
        // this.logger.log(`Received from ${service}: ${JSON.stringify(result)}`);
        return result as T;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Attempt ${attempt} failed for ${service}: ${error.message}`
        );
        if (attempt === retries) {
          throw new Error(
            `Service ${service} unavailable after ${retries} attempts: ${error.message}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error(`Service ${service} unavailable`);
  }
}
