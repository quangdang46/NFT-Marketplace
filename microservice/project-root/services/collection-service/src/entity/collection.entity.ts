import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true, enum: ['user', 'admin'] })
  creatorRole: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    required: true,
    enum: ['eth-sepolia', 'base-sepolia', 'polygon-mumbai'],
  })
  chain: string;

  @Prop({ required: true })
  contractAddress: string; // Địa chỉ contract

  @Prop({ default: 0 })
  nftCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
