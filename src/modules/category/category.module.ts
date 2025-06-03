import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [JwtService, CategoryService],
})
export class CategoryModule {}
