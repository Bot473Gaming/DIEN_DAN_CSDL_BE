import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';

export class CreateTagDto extends OmitType(Tag, ['_id', 'posts'] as const) {
  @ApiProperty({
    description: 'The name of the tag',
    example: 'technology',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  tagName: string;

  @ApiProperty({
    description: 'The description of the tag',
    example: 'Posts about technology and innovation',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
