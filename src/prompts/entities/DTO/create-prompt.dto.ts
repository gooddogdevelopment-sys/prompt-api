import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePromptDto {
  @ApiProperty({ example: 'My prompt title', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'The full prompt content goes here.' })
  content: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true, default: true })
  isActive?: boolean;
}
