import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './entities/prompt.entity';
import { CreatePromptDto } from './entities/dto/create-prompt.dto';
import { UpdatePromptDto } from './entities/dto/update-prompt.dto';
import { GetPromptDto } from './entities/dto/get-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
  ) {}

  private toDto(prompt: Prompt): GetPromptDto {
    const dto = new GetPromptDto();
    dto.id = prompt.id;
    dto.title = prompt.title;
    dto.content = prompt.content;
    dto.isActive = prompt.isActive;
    dto.createdAt = prompt.createdAt;
    dto.updatedAt = prompt.updatedAt;
    dto.responseObject = prompt.responseObject;
    return dto;
  }

  async create(
    createPromptDto: CreatePromptDto,
    userId: string,
  ): Promise<GetPromptDto> {
    const prompt = this.promptRepository.create({
      ...createPromptDto,
      userId,
    });
    const saved = await this.promptRepository.save(prompt);
    return this.toDto(saved);
  }

  async findAll(userId: string): Promise<GetPromptDto[]> {
    const prompts = await this.promptRepository.find({ where: { userId } });
    return prompts.map((p) => this.toDto(p));
  }

  async findOne(id: string, userId: string): Promise<GetPromptDto> {
    const prompt = await this.promptRepository.findOne({
      where: { id, userId },
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    return this.toDto(prompt);
  }

  async update(
    id: string,
    updatePromptDto: UpdatePromptDto,
    userId: string,
  ): Promise<GetPromptDto> {
    const existing = await this.promptRepository.findOne({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }

    const prompt = await this.promptRepository.preload({
      id,
      ...updatePromptDto,
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    const saved = await this.promptRepository.save(prompt);
    return this.toDto(saved);
  }

  async remove(id: string, userId: string): Promise<void> {
    const prompt = await this.promptRepository.findOne({
      where: { id, userId },
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    await this.promptRepository.remove(prompt);
  }
}
