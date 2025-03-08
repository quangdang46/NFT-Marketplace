import { Schema, Document } from 'mongoose';

export const TransactionLogSchema = new Schema({
  transaction_hash: { type: String, required: true },
  nft_id: { type: Number, required: true },
  seller_id: { type: Number, required: true },
  buyer_id: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
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
