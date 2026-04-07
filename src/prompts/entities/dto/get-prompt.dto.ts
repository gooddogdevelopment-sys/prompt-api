import { ApiProperty } from '@nestjs/swagger';

export class GetPromptDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'My prompt title' })
  title: string;

  @ApiProperty({ example: 'The full prompt content goes here.' })
  content: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;
}
