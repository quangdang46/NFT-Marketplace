import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";

@Injectable()
export class RabbitMQClient {
  private client: ClientProxy;
  private readonly logger = new Logger(RabbitMQClient.name);

  constructor(options: any) {
    this.logger.log(
      `Creating RabbitMQ client with options: ${JSON.stringify(options)}`
    );
    this.client = ClientProxyFactory.create(options);
  }

  async send<T>(pattern: any, data: any): Promise<T> {
    this.logger.log(
      `Sending message: ${JSON.stringify(pattern)} - ${JSON.stringify(data)}`
    );
    return this.client.send<T>(pattern, data).toPromise();
  }
}
