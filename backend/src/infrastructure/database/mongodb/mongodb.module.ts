import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionLog,
  TransactionLogSchema,
} from './schemas/transaction-log.schema';
import { Log, LogSchema } from './schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionLog.name, schema: TransactionLogSchema },
      { name: Log.name, schema: LogSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
