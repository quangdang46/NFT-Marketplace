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
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

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
  uri?: string;

  @Prop({ required: false })
  artworkUrl?: string;

  @Prop({ required: true })
  mintPrice: string;

  @Prop({ required: true })
  royaltyFee: string;

  @Prop({ required: true })
  maxSupply: string;

  @Prop({ required: true })
  mintLimit: string;

  @Prop({ required: true })
  mintStartDate: string;

  @Prop({ type: [String], default: [] })
  allowlistStages: string[];

  @Prop({ type: String, required: false })
  publicMint?: string;
}
export const CollectionSchema = SchemaFactory.createForClass(Collection);
