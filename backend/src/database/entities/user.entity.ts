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
  @Column({ nullable: true, unique: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true }) // Cho phép username có thể null nếu chỉ đăng nhập bằng ví
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar_url: string;

  @Field()
  @Column({ default: 'user' }) // Đặt mặc định là 'user'
  role: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
