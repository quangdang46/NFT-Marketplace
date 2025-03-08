import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
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

  @Field()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field()
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  
  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  last_login_at: Date;

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  login_count: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isBanned(): boolean {
    return this.status === UserStatus.BANNED;
  }
}
