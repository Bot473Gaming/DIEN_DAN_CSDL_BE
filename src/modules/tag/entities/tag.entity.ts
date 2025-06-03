import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một thẻ (tag) dùng để phân loại bài viết
 */
@Entity('tag')
export class Tag {
  @ApiProperty({ description: 'ID duy nhất của thẻ' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Tên của thẻ', maxLength: 50 })
  @Column({ length: 50, unique: true })
  @IsString()
  @Length(1, 50)
  tagName: string;

  @ApiProperty({ description: 'Mô tả của thẻ', required: false })
  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Các bài viết được gắn thẻ này' })
  @ManyToMany(() => Post, (post) => post.tags)
  @JoinTable({
    name: 'post_tag',
    joinColumn: {
      name: 'tagId', // Tên cột trong bảng liên kết
      referencedColumnName: '_id', // Tham chiếu đến _id của Tag
    },
    inverseJoinColumn: {
      name: 'postId', // Tên cột trong bảng liên kết
      referencedColumnName: '_id', // Tham chiếu đến _id của Post
    },
  })
  posts: Post[];
}
