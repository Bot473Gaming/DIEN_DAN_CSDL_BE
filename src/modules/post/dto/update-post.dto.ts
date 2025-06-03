import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['categoryId'] as const),
) {
  @ApiProperty({ description: 'Trạng thái khóa của bài viết', required: false })
  isLocked?: boolean;
}
