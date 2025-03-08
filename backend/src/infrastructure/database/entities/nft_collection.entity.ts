import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { NFT } from './nft.entity';
import { Collection } from './collection.entity';

@Entity()
export class NFTCollection {
  @PrimaryColumn()
  nft_id: string; // Hoặc UUID nếu bạn dùng UUID

  @PrimaryColumn()
  collection_id: string;

  @ManyToOne(() => NFT, (nft) => nft.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nft_id' })
  nft: NFT;

  @ManyToOne(() => Collection, (collection) => collection.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;
}
