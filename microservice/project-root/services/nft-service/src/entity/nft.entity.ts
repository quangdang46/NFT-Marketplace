import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class NFT extends Document {
  @Prop({ required: true })
  tokenId: string;

  @Prop({ required: true })
  tokenURI: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Collection' }) // Giả định có collection ref
  collectionId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['eth-sepolia', 'base-sepolia', 'polygon-mumbai'],
  })
  chain: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      traits: [
        {
          key: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
    },
    required: true,
  })
  metadata: {
    name: string;
    description: string;
    image: string;
    traits: { key: string; value: string }[];
  };

  @Prop({ default: false })
  isLazy: boolean;

  @Prop({
    required: true,
    enum: ['minted', 'lazy', 'burned'],
    default: 'minted',
  })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;
}

export const NFTSchema = SchemaFactory.createForClass(NFT);
