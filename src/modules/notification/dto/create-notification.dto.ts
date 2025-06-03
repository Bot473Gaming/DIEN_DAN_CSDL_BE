import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../../../common/enums/notification.enum';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID người dùng nhận thông báo' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Loại thông báo' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
