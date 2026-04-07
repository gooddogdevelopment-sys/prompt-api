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
    return dto;
  }

  async create(createPromptDto: CreatePromptDto): Promise<GetPromptDto> {
    const prompt = this.promptRepository.create(createPromptDto);
    const saved = await this.promptRepository.save(prompt);
    return this.toDto(saved);
  }

  async findAll(): Promise<GetPromptDto[]> {
    const prompts = await this.promptRepository.find();
    return prompts.map((p) => this.toDto(p));
  }

  async findOne(id: string): Promise<GetPromptDto> {
    const prompt = await this.promptRepository.findOneBy({ id });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    return this.toDto(prompt);
  }

  async update(
    id: string,
    updatePromptDto: UpdatePromptDto,
  ): Promise<GetPromptDto> {
    const prompt = await this.promptRepository.preload({
      id: id,
      ...updatePromptDto,
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    const saved = await this.promptRepository.save(prompt);
    return this.toDto(saved);
  }

  async remove(id: string): Promise<void> {
    const prompt = await this.promptRepository.findOneBy({ id });
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    await this.promptRepository.remove(prompt);
  }
}
