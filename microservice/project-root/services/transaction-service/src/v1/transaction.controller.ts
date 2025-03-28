import { TransactionService } from '@/v1/transaction.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {
    this.logger.log('transaction Controller initialized');
  }

  @MessagePattern({ cmd: 'ping' })
  handlePing(): string {
    this.logger.log('Received ping message');
    return 'pong';
  }

  @MessagePattern('restart')
  handleRestart() {
    this.logger.log('Restarting consumer for transaction-service-queue');
  }

  @MessagePattern({ cmd: 'create_transaction' })
  async createTransaction(
    @Payload()
    data: {
      nft_id: string;
      from_address: string;
      to_address: string;
      price: string;
      tx_hash: string;
      chain: string;
    },
  ) {
    this.logger.log(
      `Received create_transaction request for tx ${data.tx_hash}`,
    );
    return this.transactionService.createTransaction(data);
  }

  @MessagePattern({ cmd: 'update_transaction_status' })
  async updateTransactionStatus(
    @Payload() data: { txHash: string; status: 'completed' | 'failed' },
  ) {
    this.logger.log(
      `Received update_transaction_status request for tx ${data.txHash}`,
    );
    return this.transactionService.updateTransactionStatus(
      data.txHash,
      data.status,
    );
  }
}
