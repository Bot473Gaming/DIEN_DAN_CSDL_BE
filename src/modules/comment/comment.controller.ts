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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-commnt.dto';
import { Comment } from './entities/comment.entity';
import { RequestWithUser } from '../auth/common/request-with-user.interface';

@ApiTags('comments')
@Controller('comment')
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments with optional filters' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of comments to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of comments to take',
  })
  @ApiQuery({
    name: 'postId',
    required: false,
    type: String,
    description: 'Filter by post ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'parentCommentId',
    required: false,
    type: String,
    description: 'Filter by parent comment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of comments with total count',
    schema: {
      type: 'object',
      properties: {
        comments: {
          type: 'array',
          items: { $ref: '#/components/schemas/Comment' },
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
    @Query('postId') postId?: string,
    @Query('userId') userId?: string,
    @Query('parentCommentId') parentCommentId?: string,
  ) {
    const options = {
      skip,
      take,
      postId,
      userId,
      parentCommentId,
    };
    return this.commentService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return comment details',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 403, description: 'Cannot comment on a locked post' })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.create(createCommentDto, req.user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: Comment,
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to update comment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: RequestWithUser,
  ) {
    return this.commentService.update(id, updateCommentDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete comment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.commentService.remove(id, req.user.sub);
  }
}
