import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { VoteTargetType, VoteValue } from '../../../common/enums/vote.enum';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một lượt bình chọn (upvote/downvote) cho bài viết hoặc bình luận
 */
@Entity('vote')
@Index(['userId', 'targetType', 'targetId'], { unique: true })
export class Vote {
  @ApiProperty({ description: 'ID duy nhất của lượt bình chọn' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Người dùng thực hiện bình chọn' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: '_id' })
  user: User;

  @ApiProperty({ description: 'ID của người dùng thực hiện bình chọn' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Loại đối tượng được bình chọn (bài viết hoặc bình luận)',
    enum: VoteTargetType,
    example: VoteTargetType.POST,
  })
  @Column({
    type: 'enum',
    enum: VoteTargetType,
  })
  @IsEnum(VoteTargetType)
  @IsNotEmpty()
  targetType: VoteTargetType;

  @ApiProperty({ description: 'ID của đối tượng được bình chọn' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({
    description: 'Giá trị bình chọn (1 cho upvote, -1 cho downvote)',
    enum: VoteValue,
    example: VoteValue.UPVOTE,
  })
  @Column()
  @IsEnum(VoteValue)
  @IsNotEmpty()
  voteValue: VoteValue;

  @ApiProperty({
    description: 'Bài viết được bình chọn (nếu có)',
    required: false,
  })
  @ManyToOne(() => Post, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'targetId', referencedColumnName: '_id' })
  post: Post;

  @ApiProperty({
    description: 'Bình luận được bình chọn (nếu có)',
    required: false,
  })
  @ManyToOne(() => Comment, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'targetId', referencedColumnName: '_id' })
  comment: Comment;

  @ApiProperty({ description: 'Thời điểm tạo bình chọn' })
  @CreateDateColumn()
  createdAt: Date;
}
