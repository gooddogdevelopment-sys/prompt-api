import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';

export class UpdatePromptDto {
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
