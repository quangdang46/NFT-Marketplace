import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chains')
export class Chain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  contract_address: string;

  @Column({ type: 'varchar' })
  rpc_url: string;
}
