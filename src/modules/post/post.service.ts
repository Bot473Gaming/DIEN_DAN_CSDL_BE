import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Tag } from '../tag/entities/tag.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(options?: {
    skip?: number;
    take?: number;
    categoryId?: string;
    tagIds?: string[];
    userId?: string;
    search?: string;
  }): Promise<{ posts: Post[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.votes', 'votes');

    if (options?.categoryId) {
      queryBuilder.andWhere('post.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options?.tagIds?.length) {
      queryBuilder
        .innerJoin('post.tags', 'postTags')
        .andWhere('postTags._id IN (:...tagIds)', { tagIds: options.tagIds });
    }

    if (options?.userId) {
      queryBuilder.andWhere('post.userId = :userId', {
        userId: options.userId,
      });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    const total = await queryBuilder.getCount();

    if (options?.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options?.take !== undefined) {
      queryBuilder.take(options.take);
    }

    queryBuilder.orderBy('post.createdAt', 'DESC');

    const posts = await queryBuilder.getMany();

    return { posts, total };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { _id: id },
      relations: ['user', 'category', 'tags', 'comments', 'votes'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { _id: createPostDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Get tags if provided
    let tags: Tag[] = [];
    if (createPostDto.tagIds?.length) {
      tags = await this.tagRepository.findBy({
        _id: In(createPostDto.tagIds),
      });

      if (tags.length !== createPostDto.tagIds.length) {
        throw new BadRequestException('One or more tags not found');
      }
    }

    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      tags,
    });

    return this.postRepository.save(post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<Post> {
    const post = await this.findOne(id);

    // Check if user is authorized to update
    if (post.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }

    // Get tags if provided
    if (updatePostDto.tagIds?.length) {
      const tags = await this.tagRepository.findBy({
        _id: In(updatePostDto.tagIds),
      });

      if (tags.length !== updatePostDto.tagIds.length) {
        throw new BadRequestException('One or more tags not found');
      }

      post.tags = tags;
    }

    // Update other fields
    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;
    if (updatePostDto.isLocked !== undefined && isAdmin) {
      post.isLocked = updatePostDto.isLocked;
    }

    return this.postRepository.save(post);
  }

  async remove(
    id: string,
    userId: string,
    isAdmin: boolean = false,
  ): Promise<void> {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    await this.postRepository.delete(id);
  }

  async toggleLock(
    id: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<Post> {
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can lock/unlock posts');
    }

    const post = await this.findOne(id);
    post.isLocked = !post.isLocked;
    return this.postRepository.save(post);
  }
}
