import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Tiêu đề bài viết', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: 'Nội dung bài viết' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'ID của danh mục' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Danh sách ID của các thẻ',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}
