import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
// Đăng ký Enum để GraphQL nhận diện
registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(UserStatus, { name: 'UserStatus' });
@ObjectType() // Biến entity thành GraphQL ObjectType
@Entity('users')
export class User {
  @Field() // Xuất hiện trong GraphQL Schema
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Index({ unique: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Index({ unique: true })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar_url: string;

  @Field(() => UserRole) // Enum cần chỉ định kiểu
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field(() => UserStatus)
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  last_login_at: Date;

  @Field()
  @Column({ default: 0 })
  login_count: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
