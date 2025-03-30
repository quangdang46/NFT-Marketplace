import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Collection extends Document {

  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true })
  creatorRole: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  collectionImageUrl: string; // Đổi từ `image` để đồng bộ với FE

  @Prop({ type: [String], default: [] })
  images: string[]; // Giữ lại nếu dùng cho NFT sau này

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: true })
  chain: string;

  @Prop({ required: true })
  contractAddress: string;

  @Prop({ default: 0 })
  nftCount: number;

  @Prop({ required: true })
  artType: string;

  @Prop({ required: false })
  metadataUrl?: string;

  @Prop({ required: false })
  artworkUrl?: string;

  @Prop({ required: true, type: String }) // Có thể đổi thành `number` nếu cần
  mintPrice: string;

  @Prop({ required: true, type: String }) // Có thể đổi thành `number`
  royaltyFee: string;

  @Prop({ required: true, type: String }) // Có thể đổi thành `number`
  maxSupply: string;

  @Prop({ required: true, type: String }) // Có thể đổi thành `number`
  mintLimit: string;

  @Prop({ required: true })
  mintStartDate: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        mintPrice: { type: String, required: true }, // Có thể đổi thành `number`
        durationDays: { type: String, required: true }, // Có thể đổi thành `number`
        durationHours: { type: String, required: true }, // Có thể đổi thành `number`
        wallets: { type: [String], required: true },
        startDate: { type: String, required: true },
      },
    ],
    default: [],
  })
  allowlistStages: {
    id: string;
    mintPrice: string;
    durationDays: string;
    durationHours: string;
    wallets: string[];
    startDate: string;
  }[];

  @Prop({
    type: {
      mintPrice: { type: String, required: true }, // Có thể đổi thành `number`
      durationDays: { type: String, required: true }, // Có thể đổi thành `number`
      durationHours: { type: String, required: true }, // Có thể đổi thành `number`
      startDate: { type: String, required: false },
    },
    required: true,
  })
  publicMint: {
    mintPrice: string;
    durationDays: string;
    durationHours: string;
    startDate?: string;
  };
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
