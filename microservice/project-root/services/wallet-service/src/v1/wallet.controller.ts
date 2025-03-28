import { WalletService } from '@/v1/wallet.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(private readonly walletService: WalletService) {
    this.logger.log('wallet Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for wallet-service-queue');
  }

  @MessagePattern({ cmd: 'add_wallet' })
  async addWallet(
    @Payload()
    data: {
      user_id: string;
      address: string;
      chain: string;
      is_primary?: boolean;
    },
  ) {
    this.logger.log(`Received add_wallet request for user ${data.user_id}`);
    return this.walletService.addWallet(data);
  }

  @MessagePattern({ cmd: 'get_wallets' })
  async getWallets(@Payload() data: { userId: string }) {
    this.logger.log(`Received get_wallets request for user ${data.userId}`);
    return this.walletService.getWallets(data.userId);
  }
}
