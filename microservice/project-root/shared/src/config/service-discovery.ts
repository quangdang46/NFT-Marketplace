import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import Consul = require("consul");
import { getConsulConfig } from "./index";
import { RabbitMQClient } from "./rabbitmq.client";

interface ConsulServiceNode {
  ServiceMeta?: { queue?: string };
}

@Injectable()
export class ServiceDiscovery implements OnApplicationShutdown {
  private consul: Consul;
  private readonly logger = new Logger(ServiceDiscovery.name);
  private serviceId: string;
  private rabbitMQClient: RabbitMQClient;

  constructor(serviceName: string) {
    const {
      host,
      port,
      serviceName: consulServiceName,
    } = getConsulConfig(serviceName);
    this.consul = new Consul({ host, port: parseInt(port) });
    this.serviceId = `${consulServiceName}-${process.pid}`;
    this.rabbitMQClient = new RabbitMQClient(serviceName);
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

      await this.rabbitMQClient.ensureConnected();
      // this.logger.log(`Service ${this.serviceId} registered with Consul`);

      // Gọi passHealthCheck bất đồng bộ
      this.passHealthCheck().catch((error) => {
        this.logger.error(`Initial health check failed: ${error.message}`);
      });

      setInterval(() => {
        this.passHealthCheck().catch((error) => {
          this.logger.error(`Periodic health check failed: ${error.message}`);
        });
      }, 15000);
    } catch (error) {
      this.logger.error(`Failed to register service ${name}:`, error.message);
      throw error;
    }
  }

  async passHealthCheck(): Promise<void> {
    try {
      const isRabbitMQConnected = this.rabbitMQClient.getConnectionStatus();
      if (!isRabbitMQConnected) {
        throw new Error("RabbitMQ not connected");
      }

      // this.logger.log(`Sending ping to ${this.serviceId}...`);
      const response = await this.rabbitMQClient.send<string>(
        { cmd: "ping" },
        {}
      );
      // this.logger.log(`Received response: ${response}`);
      if (response !== "pong") {
        throw new Error("Ping failed");
      }

      await this.consul.agent.check.pass({
        id: `service:${this.serviceId}`,
        note: "Service is healthy",
      });
      // this.logger.log(`Health check passed for ${this.serviceId}`);
    } catch (error) {
      this.logger.error(
        `Failed to pass check for ${this.serviceId}:`,
        error.message
      );
      await this.consul.agent.check.fail({
        id: `service:${this.serviceId}`,
        note: `Health check failed: ${error.message}`,
      });
      throw error;
    }
  }

  async getServiceQueue(serviceName: string): Promise<string> {
    try {
      const services = (await this.consul.catalog.service.nodes(
        serviceName
      )) as ConsulServiceNode[];
      if (!services || services.length === 0)
        throw new Error(`Service ${serviceName} not found in Consul`);
      const queue = services[0].ServiceMeta?.queue;
      if (!queue)
        throw new Error(
          `Service ${serviceName} has no queue defined in ServiceMeta`
        );
      return queue;
    } catch (error) {
      this.logger.error(`Failed to get queue for ${serviceName}:`, error);
      throw error;
    }
  }

  async onApplicationShutdown() {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      // this.logger.log(`Deregistered service ${this.serviceId} from Consul`);
    } catch (error) {
      this.logger.error(
        `Failed to deregister service ${this.serviceId}:`,
        error
      );
    }
  }
}

export default ServiceDiscovery;
