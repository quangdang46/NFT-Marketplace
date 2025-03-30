import { Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ServiceDiscovery } from "./service-discovery";

// Định nghĩa kiểu EventsMap và Status
type EventsMap = Record<string, (...args: any[]) => void>;
type Status = string;

@Injectable()
export class RabbitMQHealthService {
  private readonly logger: Logger;

  constructor(
    private readonly serviceName: string,
    private readonly rabbitMQClient: ClientProxy<EventsMap, Status>,
    private readonly serviceDiscovery: ServiceDiscovery,
    private readonly queueName: string,
    private readonly tags: string[]
  ) {
    this.logger = new Logger(`${RabbitMQHealthService.name} (${serviceName})`);
  }

  async initializeRabbitMQ(
    maxAttempts: number = 40,
    retryDelay: number = 250
  ): Promise<boolean> {
    let clientReady = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.rabbitMQClient.connect();
        clientReady = true;
        // this.logger.log("RabbitMQ client is ready");
        break;
      } catch (error) {
        this.logger.warn(
          `Client not ready, retrying (${attempt + 1}/${maxAttempts})...`,
          error.message ||
            (error as any).code ||
            (error as any).stack ||
            "Unknown error"
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (!clientReady) {
      this.logger.error(
        `Failed to initialize RabbitMQ client after ${maxAttempts} attempts`
      );
    }

    return clientReady;
  }
  async attemptInitialHealthCheck(
    maxRetries: number = 3,
    retryDelay: number = 5000
  ) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        try {
          await this.rabbitMQClient.connect();
        } catch (error) {
          this.logger.warn(
            "RabbitMQ client not connected before health check",
            error.message ||
              (error as any).code ||
              (error as any).stack ||
              "Unknown error"
          );
          throw new Error("RabbitMQ client not connected");
        }

        await this.serviceDiscovery.passHealthCheck();
        // this.logger.log("Initial health check passed");
        return;
      } catch (error) {
        this.logger.error(
          `Initial health check failed (attempt ${i + 1}/${maxRetries}): ${
            error.message
          }`
        );
        if (i < maxRetries - 1) {
          this.logger.log(`Retrying health check after ${retryDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
    this.logger.error("Failed to pass initial health check after all retries");
  }

  startPeriodicHealthCheck(
    maxAttempts: number = 40,
    retryDelay: number = 250,
    interval: number = 10000
  ) {
    setInterval(async () => {
      try {
        try {
          await this.rabbitMQClient.connect();
        } catch (error) {
          this.logger.warn(
            "RabbitMQ client not connected before periodic health check",
            error.message ||
              (error as any).code ||
              (error as any).stack ||
              "Unknown error"
          );
          throw new Error("RabbitMQ client not connected");
        }

        await this.serviceDiscovery.passHealthCheck();
        // this.logger.log("Periodic health check passed");
      } catch (error) {
        this.logger.error(`Periodic health check failed: ${error.message}`);
        let reconnected = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            await this.rabbitMQClient.connect();
            reconnected = true;
            this.logger.log(
              "Reconnected to RabbitMQ after health check failure"
            );

            await this.serviceDiscovery.registerService(
              this.serviceName,
              { queue: this.queueName },
              this.tags
            );
            this.logger.log(
              "Re-registered service with Consul after health check failure"
            );
            this.rabbitMQClient.emit("restart", {});
            this.logger.log(
              "Restarted microservice to re-register consumers after health check failure"
            );
            break;
          } catch (reconnectError) {
            this.logger.warn(
              `Reconnect failed during health check, retrying (${
                attempt + 1
              }/${maxAttempts})...`,
              reconnectError.message ||
                (reconnectError as any).code ||
                (reconnectError as any).stack ||
                "Unknown error"
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        if (!reconnected) {
          this.logger.error(
            `Failed to reconnect to RabbitMQ after ${maxAttempts} attempts during health check`
          );
        }
      }
    }, interval);
  }
}

export { ClientProxy };
