import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class UpdatePromptDto {
  @ApiHideProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsObject()
  responseObject: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
