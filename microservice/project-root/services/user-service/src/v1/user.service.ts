import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ServiceClient } from '@project/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly serviceClient: ServiceClient,
  ) {}

  async findOrCreateUser(address: string) {
    let user = await this.userRepository.findOne({ where: { address } });
    if (!user) {
      user = this.userRepository.create({
        address,
        created_at: new Date(),
        last_login_at: new Date(),
      });
    } else {
      user.last_login_at = new Date();
      user.login_count += 1;
    }
    await this.userRepository.save(user);
    return user;
  }
}
