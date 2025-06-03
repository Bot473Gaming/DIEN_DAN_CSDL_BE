import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Tag } from '../tag/entities/tag.entity';
import { Category } from '../category/entities/category.entity';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, Category])],
  controllers: [PostController],
  providers: [JwtService, PostService],
  exports: [PostService],
})
export class PostModule {}
