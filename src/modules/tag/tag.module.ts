import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [JwtService, TagService],
  exports: [TagService],
})
export class TagModule {}
