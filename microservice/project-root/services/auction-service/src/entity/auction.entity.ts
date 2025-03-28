import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nft_id: string;

  @Column({ type: 'varchar' })
  seller: string;

  @Column({ type: 'decimal' })
  starting_price: string;

  @Column({ type: 'decimal', default: '0' })
  current_bid: string;

  @Column({ type: 'varchar', nullable: true })
  bidder: string;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'varchar' })
  chain: string;

  @Column({ type: 'varchar', default: 'active' })
  status: string; // 'active', 'ended'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
