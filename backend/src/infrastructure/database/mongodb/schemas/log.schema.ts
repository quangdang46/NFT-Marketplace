import { Schema, Document } from 'mongoose';

export const LogSchema = new Schema(
  {
    address: { type: String, required: true }, // Địa chỉ ví
    action: { type: String, required: true }, // Hành động (ví dụ: connect-wallet, disconnect-wallet)
    timestamp: { type: Date, default: Date.now }, // Thời gian thực hiện hành động
    metadata: { type: Schema.Types.Mixed }, // Dữ liệu bổ sung (nếu cần)
  },
  { collection: 'logs' }, // Tên collection trong MongoDB
);

// Định nghĩa interface cho document
export class Log extends Document {
  address: string;
  action: string;
  timestamp: Date;
  metadata?: any;
}
