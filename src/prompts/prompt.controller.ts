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
import { CreatePromptDto } from './entities/dto/create-prompt.dto';
import { UpdatePromptDto } from './entities/dto/update-prompt.dto';
import { GetPromptDto } from './entities/dto/get-prompt.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('prompts')
@ApiBearerAuth('clerk-jwt')
@Controller('prompts')
export class PromptController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(
    @Body() createPromptDto: CreatePromptDto,
  ): Promise<GetPromptDto> {
    return await this.promptsService.create(createPromptDto);
  }

  @Get()
  async findAll(): Promise<GetPromptDto[]> {
    return await this.promptsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetPromptDto> {
    return await this.promptsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<GetPromptDto> {
    return await this.promptsService.update(id, updatePromptDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.promptsService.remove(id);
  }
}
