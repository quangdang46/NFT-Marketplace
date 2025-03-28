import { Transaction } from '@/entity/transaction.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceClient } from '@project/shared';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(data: {
    nft_id: string;
    from_address: string;
    to_address: string;
    price: string;
    tx_hash: string;
    chain: string;
  }) {
    const transaction = this.transactionRepository.create({
      nft_id: data.nft_id,
      from_address: data.from_address,
      to_address: data.to_address,
      price: data.price,
      tx_hash: data.tx_hash,
      chain: data.chain,
      status: 'pending',
    });
    const savedTransaction = await this.transactionRepository.save(transaction);
    this.logger.log(`Created transaction ${savedTransaction.id}`);
    return { transactionId: savedTransaction.id };
  }

  async updateTransactionStatus(
    txHash: string,
    status: 'completed' | 'failed',
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: { tx_hash: txHash },
    });
    if (!transaction) throw new Logger('Transaction not found');
    transaction.status = status;
    await this.transactionRepository.save(transaction);
    this.logger.log(`Updated transaction ${txHash} to ${status}`);
    return { success: true };
  }
}
