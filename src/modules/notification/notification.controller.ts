import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo thông báo mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo thông báo thành công',
    type: Notification,
  })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của người dùng hiện tại' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  async findAll(
    @Request() req: RequestWithUser,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('isRead') isRead?: boolean,
  ): Promise<{ notifications: Notification[]; total: number }> {
    return await this.notificationService.findAll({
      userId: req.user._id,
      skip,
      take,
      isRead,
    });
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Đếm số thông báo chưa đọc' })
  @ApiResponse({ status: 200, description: 'Số lượng thông báo chưa đọc' })
  async getUnreadCount(
    @Request() req: RequestWithUser,
  ): Promise<{ count: number }> {
    const count = await this.notificationService.getUnreadCount(req.user._id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu đã đọc thành công' })
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return await this.notificationService.markAsRead(id);
  }

  @Patch('read/all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu tất cả đã đọc thành công',
  })
  async markAllAsRead(@Request() req: RequestWithUser): Promise<void> {
    await this.notificationService.markAllAsRead(req.user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiResponse({ status: 200, description: 'Xóa thông báo thành công' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.notificationService.remove(id);
  }
}
