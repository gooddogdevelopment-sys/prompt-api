import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PromptsService } from './prompt.service';
import { CreatePromptDto } from './entities/DTO/create-prompt.dto';
import { Prompt } from './entities/prompt.entity';
import { UpdatePromptDto } from './entities/DTO/update-prompt.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('prompts')
@ApiBearerAuth('clerk-jwt')
@Controller('prompts')
export class PromptController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(@Body() createPromptDto: CreatePromptDto): Promise<Prompt> {
    return await this.promptsService.create(createPromptDto);
  }

  @Get()
  async findAll(): Promise<Prompt[]> {
    return await this.promptsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Prompt> {
    return await this.promptsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<Prompt> {
    return await this.promptsService.update(id, updatePromptDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.promptsService.remove(id);
  }
}
