import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Sub-schema cho AllowlistStage
@Schema()
export class AllowlistStage {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) mintPrice: string;
  @Prop({ required: true }) startDate: string;
  @Prop({ required: true }) durationDays: string;
  @Prop({ required: true }) durationHours: string;
  @Prop({ type: [String], required: true }) wallets: string[];
}

// Sub-schema cho PublicMint
@Schema()
export class PublicMint {
  @Prop({ required: true }) mintPrice: string;
  @Prop({ required: true, default: () => new Date().toISOString() })
  startDate: string;
  @Prop({ required: true }) durationDays: string;
  @Prop({ required: true }) durationHours: string;
}

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ required: true }) creatorId: string;
  @Prop({ required: true }) creatorRole: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) image: string;
  @Prop({ required: true }) uri: string; // Nếu không cần, có thể đặt required: false
  @Prop({ required: true }) chain: string;
  @Prop({ required: true }) chainId: string;
  @Prop({ required: true }) contractAddress: string; // Nếu không cần, có thể đặt required: false
  @Prop({ default: false }) isVerified: boolean;
  @Prop({ required: true }) mintPrice: string; // Non-nullable trong GraphQL
  @Prop({ required: true }) royaltyFee: string; // Không có trong dữ liệu, nên optional
  @Prop({ required: true }) maxSupply: string; // Non-nullable trong GraphQL
  @Prop({ required: true }) mintLimit: string; // Không có trong dữ liệu, nên optional
  @Prop({ required: true }) mintStartDate: string; // Non-nullable trong GraphQL
  @Prop({ type: [AllowlistStage], default: [] })
  allowlistStages: AllowlistStage[];
  @Prop({ type: PublicMint, required: false }) publicMint?: PublicMint;
  @Prop({ default: 0 }) nftCount: number;
  @Prop({ default: '0' }) totalMinted: string;
  @Prop({ required: false }) status: string; // Thêm trường status
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
