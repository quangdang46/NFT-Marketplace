import { NFT } from './nft.entity';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => NFT, (nft) => nft.id)
  @JoinColumn({ name: 'nft_id' })
  nft: NFT;

  @Column()
  transactionHash: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
