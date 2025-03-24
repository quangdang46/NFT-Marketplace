import { Resolver, Query } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { Test } from '../../graphql/types/test.type';

@Resolver(() => Test)
export class TestResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Query(() => Test)
  async test() {
    const result = await this.gatewayService
      .sendToService('test-service', { cmd: 'test' }, {})
      .catch(() => ({ message: 'Hello from GraphQL Test!' }));
    return result;
  }
}
