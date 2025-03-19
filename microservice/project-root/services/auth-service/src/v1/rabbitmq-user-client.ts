import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { getRabbitMQConfig, UserClient,ConfigService } from '@project/shared';

@Injectable()
export class RabbitMQUserClient implements UserClient {
  private client: ClientProxy;

  constructor(configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: getRabbitMQConfig(configService, 'USER'),
    });
  }

  async findOrCreateUser(address: string) {
    return firstValueFrom(
      this.client.send({ cmd: 'find_or_create_user' }, { address }),
    );
  }
}
