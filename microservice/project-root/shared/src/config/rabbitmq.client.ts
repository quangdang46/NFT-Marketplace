import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { ConfigService } from "./shared-config.module";
import { getRabbitMQConfig } from "./index";
import * as amqplib from "amqplib";

@Injectable()
export class RabbitMQClient implements OnApplicationShutdown {
  private client: ClientProxy | null = null;
  private readonly logger = new Logger(RabbitMQClient.name);
  private readonly options: any;
  private isConnected = false;
  private maxRetries = 5;
  private retryDelay = 2000;

  constructor(configService: ConfigService, serviceName: string) {
    this.options = getRabbitMQConfig(configService, serviceName);
    this.initializeClientWithRetry();
  }

  private async fixQueueMismatch(): Promise<void> {
    try {
      const connection = await amqplib.connect(this.options.options.urls[0]);
      const channel = await connection.createChannel();
      const queue = this.options.options.queue;
      this.logger.warn(`Attempting to delete queue ${queue} to fix mismatch`);
      await channel.deleteQueue(queue);
      await channel.close();
      await connection.close();
      this.logger.log(`Queue ${queue} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to delete queue ${this.options.options.queue}:`,
        error.message
      );
      throw error;
    }
  }

  private async initializeClientWithRetry(attempt = 0): Promise<void> {
    if (attempt >= this.maxRetries) {
      this.logger.error(
        `Failed to initialize RabbitMQ client after ${this.maxRetries} attempts`
      );
      throw new Error("Failed to initialize RabbitMQ client");
    }

    try {
      this.logger.log(
        `Initializing RabbitMQ client (attempt ${attempt + 1}/${
          this.maxRetries
        }) with options: ${JSON.stringify(this.options)}`
      );
      this.client = ClientProxyFactory.create(this.options);
      await this.client.connect();
      this.isConnected = true;
      this.logger.log("Successfully connected to RMQ broker");
    } catch (error) {
      this.isConnected = false;
      this.logger.error(
        `Failed to connect to RMQ (attempt ${attempt + 1}): ${error.message}`
      );
      if (
        error.message.includes("PRECONDITION-FAILED") &&
        error.message.includes("durable")
      ) {
        await this.fixQueueMismatch();
        await this.initializeClientWithRetry(attempt);
      } else {
        if (this.client) {
          await this.client.close();
          this.client = null;
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        await this.initializeClientWithRetry(attempt + 1);
      }
    }
  }

  async ensureConnected(): Promise<void> {
    if (!this.isConnected || !this.client) {
      this.logger.warn("RMQ not connected, waiting for connection...");
      await this.initializeClientWithRetry();
      if (!this.isConnected) {
        throw new Error("Failed to connect to RabbitMQ after retries");
      }
    }
  }

  async send<T>(pattern: any, data: any): Promise<T> {
    await this.ensureConnected();
    this.logger.log(
      `Sending message to queue ${this.options.options.queue}: ${JSON.stringify(
        pattern
      )} - ${JSON.stringify(data)}`
    );
    try {
      const response = await this.client!.send<T>(pattern, data).toPromise();
      this.logger.log(
        `Received response from queue ${
          this.options.options.queue
        }: ${JSON.stringify(response)}`
      );
      return response;
    } catch (error) {
      this.isConnected = false;
      this.logger.error(
        `Send failed on queue ${this.options.options.queue}: ${error.message}`
      );
      await this.reconnect();
      throw error;
    }
  }

  private async reconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    await this.initializeClientWithRetry();
  }

  async onApplicationShutdown() {
    if (this.client) {
      await this.client.close();
      this.logger.log("RabbitMQ client closed");
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
