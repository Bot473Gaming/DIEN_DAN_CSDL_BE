import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Vote } from '../../vote/entities/vote.entity';
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một bình luận dưới bài viết
 */
@Entity('comment')
export class Comment {
  @ApiProperty({ description: 'ID duy nhất của bình luận' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Bài viết chứa bình luận này' })
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId', referencedColumnName: '_id' })
  post: Post;

  @ApiProperty({ description: 'ID của bài viết' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ description: 'Tác giả bình luận' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: '_id' })
  user: User;

  @ApiProperty({ description: 'ID của tác giả' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Nội dung bình luận' })
  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Bình luận cha (nếu là bình luận trả lời)',
    required: false,
  })
  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: '_id' })
  parentComment: Comment;

  @ApiProperty({
    description: 'ID của bình luận cha (nếu có)',
    required: false,
  })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  parentCommentId: string;

  @ApiProperty({ description: 'Các bình luận trả lời' })
  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @ApiProperty({ description: 'Các lượt bình chọn của bình luận' })
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @ApiProperty({ description: 'Thời điểm tạo bình luận' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Thời điểm cập nhật bình luận' })
  @UpdateDateColumn()
  updatedAt: Date;
}
