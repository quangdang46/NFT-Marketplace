import { Wallet } from '@/entity/wallet.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly serviceClient: ServiceClient,
  ) {}

  async addWallet(data: {
    user_id: string;
    address: string;
    chain: string;
    is_primary?: boolean;
  }) {
    if (data.is_primary) {
      await this.walletRepository.update(
        { user_id: data.user_id, is_primary: true },
        { is_primary: false },
      );
    }

    const wallet = this.walletRepository.create({
      user_id: data.user_id,
      address: data.address,
      chain: data.chain,
      is_primary: data.is_primary || false,
    });
    const savedWallet = await this.walletRepository.save(wallet);
    this.logger.log(`Added wallet ${savedWallet.id} for user ${data.user_id}`);
    return { walletId: savedWallet.id };
  }

  async getWallets(userId: string) {
    const wallets = await this.walletRepository.find({
      where: { user_id: userId },
    });
    return wallets.map((w) => ({
      id: w.id,
      address: w.address,
      chain: w.chain,
      is_primary: w.is_primary,
    }));
  }
}
