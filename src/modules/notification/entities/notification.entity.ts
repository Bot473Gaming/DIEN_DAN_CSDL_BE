import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NotificationType } from '../../../common/enums/notification.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity đại diện cho một thông báo gửi đến người dùng
 */
@Entity('notification')
export class Notification {
  @ApiProperty({ description: 'ID của thông báo' })
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ApiProperty({ description: 'Người dùng nhận thông báo' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: '_id' })
  user: User;

  @ApiProperty({ description: 'ID người dùng nhận thông báo' })
  @Column()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Loại thông báo' })
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @Column({ length: 255 })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Trạng thái đã đọc' })
  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  createdAt: Date;
}
