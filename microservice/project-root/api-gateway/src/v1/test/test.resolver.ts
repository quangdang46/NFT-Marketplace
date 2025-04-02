import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { GatewayService } from '../gateway.service';
import { Test } from '../../graphql/types/test.type';
import { Inject } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => Test)
export class TestResolver {
  constructor(@Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}
  // Query bình thường
  @Query(() => String)
  hello() {
    return 'Hello, GraphQL Subscriptions!';
  }

  // Mutation để gửi dữ liệu mới qua subscription
  @Mutation(() => String)
  async sendMessage(@Args('message') message: string): Promise<string> {
    await this.pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
    return `Message sent: ${message}`;
  }

  // Subscription để lắng nghe thay đổi qua WebSocket
  @Subscription(() => String, {
    resolve: (payload) => payload.messageAdded, // Trả về nội dung message từ mutation
  })
  messageAdded() {
    return this.pubSub.asyncIterator('MESSAGE_ADDED'); // Sửa thành asyncIterator
  }
}
