import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ required: true }) creatorId: string;
  @Prop({ required: true }) creatorRole: string;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) image: string; // URL ảnh collection
  @Prop({ required: true }) uri: string; // URL JSON metadata
  @Prop({ required: true }) chain: string;
  @Prop({ required: true }) contractAddress: string;
  @Prop({ default: false }) isVerified: boolean;
  @Prop() mintPrice: string;
  @Prop() royaltyFee: string; // Basis points
  @Prop() maxSupply: string;
  @Prop() mintLimit: string;
  @Prop() mintStartDate: string;
  @Prop({ type: [Object], default: [] }) allowlistStages: any[];
  @Prop({ type: Object }) publicMint: any;
  @Prop({ default: 0 }) nftCount: number;
  @Prop({ default: '0' })
  totalMinted: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
