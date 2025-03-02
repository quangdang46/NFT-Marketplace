import { Schema, Document } from 'mongoose';

export const TransactionLogSchema = new Schema({
  transaction_hash: String,
  nft_id: Number,
  seller_id: Number,
  buyer_id: Number,
  price: Number,
  currency: String,
  created_at: { type: Date, default: Date.now },
});

// Định nghĩa class thay vì interface
export class TransactionLog extends Document {
  transaction_hash: string;
  nft_id: number;
  seller_id: number;
  buyer_id: number;
  price: number;
  currency: string;
  created_at: Date;
}
