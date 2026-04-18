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
import { CurrentUserId } from '../auth/current-user.decorator';

@ApiTags('prompts')
@ApiBearerAuth('clerk-jwt')
@Controller('prompts')
export class PromptController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(
    @Body() createPromptDto: CreatePromptDto,
    @CurrentUserId() userId: string,
  ): Promise<GetPromptDto> {
    return await this.promptsService.create(createPromptDto, userId);
  }

  @Get()
  async findAll(@CurrentUserId() userId: string): Promise<GetPromptDto[]> {
    return await this.promptsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<GetPromptDto> {
    return await this.promptsService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromptDto: UpdatePromptDto,
    @CurrentUserId() userId: string,
  ): Promise<GetPromptDto> {
    return await this.promptsService.update(id, updatePromptDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return await this.promptsService.remove(id, userId);
  }
}
