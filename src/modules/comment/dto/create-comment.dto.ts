import { ApiProperty } from '@nestjs/swagger';
import { PickType, PartialType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// First pick the required fields
class CommentBaseDto extends PickType(Comment, [
  'postId',
  'content',
] as const) {}

// Then make parentCommentId optional
export class CreateCommentDto extends PartialType(CommentBaseDto) {
  @ApiProperty({ description: 'ID của bài viết' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ description: 'Nội dung bình luận' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID của bình luận cha (nếu là bình luận trả lời)',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentCommentId?: string;
}
