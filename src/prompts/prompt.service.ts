import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './entities/prompt.entity';
import { CreatePromptDto } from './entities/DTO/create-prompt.dto';
import { UpdatePromptDto } from './entities/DTO/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
  ) {}

  async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
    const prompt = this.promptRepository.create(createPromptDto);
    return await this.promptRepository.save(prompt);
  }

  async findAll(): Promise<Prompt[]> {
    return await this.promptRepository.find();
  }

  async findOne(id: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOneBy({ id });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    return prompt;
  }

  async update(id: string, updatePromptDto: UpdatePromptDto): Promise<Prompt> {
    const prompt = await this.promptRepository.preload({
      id: id,
      ...updatePromptDto,
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    return this.promptRepository.save(prompt);
  }

  async remove(id: string): Promise<void> {
    const prompt = await this.findOne(id);
    await this.promptRepository.remove(prompt);
  }
}
