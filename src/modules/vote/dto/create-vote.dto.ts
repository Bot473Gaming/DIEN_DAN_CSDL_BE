import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VoteTargetType, VoteValue } from '../../../common/enums/vote.enum';

export class CreateVoteDto {
  @ApiProperty({
    description: 'ID of the target (post or comment) to vote on',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({
    description: 'Type of the target (post or comment)',
    enum: VoteTargetType,
    example: VoteTargetType.POST,
  })
  @IsEnum(VoteTargetType)
  @IsNotEmpty()
  targetType: VoteTargetType;

  @ApiProperty({
    description: 'Type of vote (upvote or downvote)',
    enum: VoteValue,
    example: VoteValue.UPVOTE,
  })
  @IsEnum(VoteValue)
  @IsNotEmpty()
  voteValue: VoteValue;
}
