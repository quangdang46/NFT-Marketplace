import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class NFT {
  @Field(() => Int) // Cần khai báo để GraphQL nhận diện
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  image_url: string;

  @Field()
  @Column()
  metadata_url: string;

  @Field(() => User) // Thiếu @Field nên chưa hoạt động
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Field(() => User) // Thêm @Field() vào creator
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Field()
  @Column()
  contract_address: string;

  @Field()
  @Column()
  token_id: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
