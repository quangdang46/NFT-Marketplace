import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int) // GraphQL cần khai báo kiểu dữ liệu
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true }) // Cần thêm Field cho GraphQL
  @Column({ nullable: true })
  wallet_address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Field()
  @Column()
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar_url: string;

  @Field()
  @Column()
  role: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
