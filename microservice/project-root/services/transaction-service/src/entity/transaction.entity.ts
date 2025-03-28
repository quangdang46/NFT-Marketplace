import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nft_id: string;

  @Column({ type: 'varchar' })
  from_address: string;

  @Column({ type: 'varchar' })
  to_address: string;

  @Column({ type: 'decimal' })
  price: string;

  @Column({ type: 'varchar' })
  tx_hash: string;

  @Column({ type: 'varchar' })
  chain: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: string; // 'pending', 'completed', 'failed'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
