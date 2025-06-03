import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from '../post/entities/post.entity';
import { JwtService } from '@nestjs/jwt';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentController],
  providers: [JwtService, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
