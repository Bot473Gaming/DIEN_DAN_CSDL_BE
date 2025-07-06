import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnt.dto';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(options?: {
    skip?: number;
    take?: number;
    postId?: string;
    userId?: string;
    parentCommentId?: string | null;
  }): Promise<{ comments: Comment[]; total: number }> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.votes', 'votes');

    if (options?.postId) {
      queryBuilder.andWhere('comment.postId = :postId', {
        postId: options.postId,
      });
    }

    if (options?.userId) {
      queryBuilder.andWhere('comment.userId = :userId', {
        userId: options.userId,
      });
    }

    if (options?.parentCommentId !== undefined) {
      queryBuilder.andWhere('comment.parentCommentId = :parentCommentId', {
        parentCommentId: options.parentCommentId,
      });
    }

    const total = await queryBuilder.getCount();

    if (options?.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options?.take !== undefined) {
      queryBuilder.take(options.take);
    }

    queryBuilder.orderBy('comment.createdAt', 'DESC');

    const comments = await queryBuilder.getMany();

    return { comments, total };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { _id: id },
      relations: ['user', 'post', 'parentComment', 'replies', 'votes'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({
      where: { _id: createCommentDto.postId },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }
    if (post.isLocked) {
      throw new ForbiddenException('Cannot comment on a locked post');
    }

    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { _id: createCommentDto.parentCommentId },
      });

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }
      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException(
          'Parent comment does not belong to the same post',
        );
      }
    }
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
    });
    return this.commentRepository.save(comment);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to update this comment',
      );
    }
    const post = await this.postRepository.findOne({
      where: { _id: comment.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.isLocked && !isAdmin) {
      throw new ForbiddenException('Cannot update comment on a locked post');
    }
    // Update content
    if (updateCommentDto.content) {
      comment.content = updateCommentDto.content;
    }
    return this.commentRepository.save(comment);
  }

  async remove(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    const comment = await this.findOne(id);
    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete this comment',
      );
    }
    const post = await this.postRepository.findOne({
      where: { _id: comment.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.isLocked && !isAdmin) {
      throw new ForbiddenException('Cannot delete comment on a locked post');
    }
    if (comment.replies?.length > 0 && !isAdmin) {
      throw new ForbiddenException(
        'Cannot delete comment with replies. Please contact an admin.',
      );
    }
    await this.commentRepository.remove(comment);
  }
}
