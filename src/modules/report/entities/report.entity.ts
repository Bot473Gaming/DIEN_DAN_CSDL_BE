import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ReportStatus } from '../../../common/enums/report.enum';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một báo cáo vi phạm từ người dùng
 */
@Entity('report')
export class Report {
  @ApiProperty({ description: 'ID duy nhất của báo cáo' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Người dùng tạo báo cáo' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: '_id' })
  user: User;

  @ApiProperty({ description: 'ID của người dùng tạo báo cáo' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Bài viết bị báo cáo (nếu có)', required: false })
  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: 'postId', referencedColumnName: '_id' })
  post: Post;

  @ApiProperty({
    description: 'ID của bài viết bị báo cáo (nếu có)',
    required: false,
  })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  postId: string;

  @ApiProperty({
    description: 'Bình luận bị báo cáo (nếu có)',
    required: false,
  })
  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'commentId', referencedColumnName: '_id' })
  comment: Comment;

  @ApiProperty({
    description: 'ID của bình luận bị báo cáo (nếu có)',
    required: false,
  })
  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  commentId: string;

  @ApiProperty({ description: 'Lý do báo cáo' })
  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Trạng thái của báo cáo',
    enum: ReportStatus,
    example: ReportStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({ description: 'Thời điểm tạo báo cáo' })
  @CreateDateColumn()
  createdAt: Date;
}
