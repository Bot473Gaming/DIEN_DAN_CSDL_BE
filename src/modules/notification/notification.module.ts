import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [JwtService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
