import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(Category, ['name'] as const) {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Technology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
