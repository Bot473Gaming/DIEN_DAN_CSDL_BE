import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Vote } from '../../vote/entities/vote.entity';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsBoolean,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một bài viết trên diễn đàn
 */
@Entity('post')
export class Post {
  @ApiProperty({ description: 'ID duy nhất của bài viết' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Tiêu đề bài viết', maxLength: 255 })
  @Column({ length: 255 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: 'Nội dung bài viết' })
  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Tác giả bài viết' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: '_id' })
  user: User;

  @ApiProperty({ description: 'ID của tác giả' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Danh mục của bài viết' })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId', referencedColumnName: '_id' })
  category: Category;

  @ApiProperty({ description: 'ID của danh mục' })
  @Column()
  @IsInt()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Các thẻ được gắn cho bài viết' })
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({
    name: 'post_tag',
    joinColumn: {
      name: 'postId', // Tên cột trong bảng liên kết
      referencedColumnName: '_id', // Tham chiếu đến _id của Post
    },
    inverseJoinColumn: {
      name: 'tagId', // Tên cột trong bảng liên kết
      referencedColumnName: '_id', // Tham chiếu đến _id của Tag
    },
  })
  tags: Tag[];

  @ApiProperty({ description: 'Các bình luận của bài viết' })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ApiProperty({ description: 'Các lượt bình chọn của bài viết' })
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @ApiProperty({ description: 'Trạng thái khóa của bài viết' })
  @Column({ default: false })
  @IsBoolean()
  isLocked: boolean;

  @ApiProperty({ description: 'Thời điểm tạo bài viết' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Thời điểm cập nhật bài viết' })
  @UpdateDateColumn()
  updatedAt: Date;
}
