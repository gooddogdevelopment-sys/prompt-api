import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptsService } from './prompt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prompt } from './entities/prompt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prompt])],
  controllers: [PromptController],
  providers: [PromptsService],
})
export class PromptModule {}
