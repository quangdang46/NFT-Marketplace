import { NFT } from './nft.entity';
import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => NFT, (nft) => nft.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nft_id' })
  nft: NFT;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['listed', 'sold', 'cancelled'],
    default: 'listed',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
