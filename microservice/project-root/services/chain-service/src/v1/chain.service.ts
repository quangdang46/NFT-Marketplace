import { Chain } from '@/entity/chain.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import { Repository } from 'typeorm';

@Injectable()
export class ChainService {
  private readonly logger = new Logger(ChainService.name);

  constructor(
    @InjectRepository(Chain)
    private readonly chainRepository: Repository<Chain>,
  ) {}

  async addChain(data: {
    name: string;
    contract_address: string;
    rpc_url: string;
  }) {
    const chain = this.chainRepository.create(data);
    const savedChain = await this.chainRepository.save(chain);
    this.logger.log(`Added chain ${savedChain.id}`);
    return { chainId: savedChain.id };
  }

  async getChain(name: string) {
    const chain = await this.chainRepository.findOne({ where: { name } });
    return chain
      ? {
          id: chain.id,
          name: chain.name,
          contract_address: chain.contract_address,
          rpc_url: chain.rpc_url,
        }
      : null;
  }
}
