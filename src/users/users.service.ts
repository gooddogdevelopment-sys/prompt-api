import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../prompts/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createFromClerk(providerUserId: string): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { providerUserId },
    });

    if (existing) {
      this.logger.log(
        `User already exists for providerUserId=${providerUserId}, skipping insert`,
      );
      return existing;
    }

    const user = this.userRepository.create({ providerUserId });
    const saved = await this.userRepository.save(user);
    this.logger.log(
      `Created user id=${saved.id} for providerUserId=${providerUserId}`,
    );
    return saved;
  }
}
