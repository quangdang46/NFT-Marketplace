import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nft_id: string;

  @Column({ type: 'varchar' })
  seller: string;

  @Column({ type: 'decimal' })
  price: string;

  @Column({ type: 'varchar' })
  chain: string;

  @Column({ type: 'varchar', nullable: true })
  buyer: string;

  @Column({ type: 'varchar', default: 'open' })
  status: string; // 'open', 'matched'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
