import { ChainService } from '@/v1/chain.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('chain')
export class ChainController {
  private readonly logger = new Logger(ChainController.name);

  constructor(private readonly chainService: ChainService) {
    this.logger.log('chain Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for chain-service-queue');
  }

  @MessagePattern({ cmd: 'add_chain' })
  async addChain(
    @Payload()
    data: {
      name: string;
      contract_address: string;
      rpc_url: string;
    },
  ) {
    this.logger.log(`Received add_chain request for ${data.name}`);
    return this.chainService.addChain(data);
  }

  @MessagePattern({ cmd: 'get_chain' })
  async getChain(@Payload() data: { name: string }) {
    this.logger.log(`Received get_chain request for ${data.name}`);
    return this.chainService.getChain(data.name);
  }
}
