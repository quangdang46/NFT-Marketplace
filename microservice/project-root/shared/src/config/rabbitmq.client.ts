import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices";

@Injectable()
export class RabbitMQClient {
  private client: ClientProxy;

  constructor(@Inject("RABBITMQ_OPTIONS") private rmqOptions: any) {
    this.client = ClientProxyFactory.create(rmqOptions);
  }

  async send<T>(pattern: any, data: any): Promise<T> {
    return this.client.send(pattern, data).toPromise();
  }
}
