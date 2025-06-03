import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { RequestWithUser } from '../auth/common/request-with-user.interface';
import { Post as PostEntity } from './entities/post.entity';

@ApiTags('posts')
@Controller('post')
@ApiBearerAuth('JWT-auth')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with optional filters' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of posts to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of posts to take',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'tagIds',
    required: false,
    type: String,
    description: 'Filter by tag IDs (comma-separated)',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in title and content',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of posts with total count',
    schema: {
      type: 'object',
      properties: {
        posts: {
          type: 'array',
          items: { $ref: '#/components/schemas/Post' },
        },
        total: {
          type: 'number',
          example: 100,
        },
      },
    },
  })
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('categoryId') categoryId?: string,
    @Query('tagIds') tagIds?: string,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
  ) {
    const options = {
      skip,
      take,
      categoryId,
      tagIds: tagIds ? tagIds.split(',') : undefined,
      userId,
      search,
    };
    return this.postService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return post details',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: RequestWithUser,
  ) {
    return this.postService.create(createPostDto, req.user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to update post' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: RequestWithUser,
  ) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.postService.update(id, updatePostDto, req.user.sub, isAdmin);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete post' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.postService.remove(id, req.user.sub, isAdmin);
  }

  @ApiOperation({ summary: 'Toggle post lock status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Post lock status toggled successfully',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to lock/unlock post',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/lock')
  async toggleLock(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.postService.toggleLock(id, req.user.sub, true);
  }
}
