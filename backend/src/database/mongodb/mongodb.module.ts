import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionLog,
  TransactionLogSchema,
} from './schemas/transaction-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLog.name, schema: TransactionLogSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
