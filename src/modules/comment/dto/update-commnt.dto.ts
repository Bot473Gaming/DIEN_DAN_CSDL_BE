import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

// First omit the fields that shouldn't be updated
// Then make all remaining fields optional
export class UpdateCommentDto extends PartialType(
  OmitType(CreateCommentDto, ['postId', 'parentCommentId'] as const),
) {}
