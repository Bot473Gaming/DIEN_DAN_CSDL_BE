import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RequestWithUser } from '../auth/common/request-with-user.interface';
import { Vote } from './entities/vote.entity';
import { VoteTargetType, VoteValue } from '../../common/enums/vote.enum';

interface FindAllOptions {
  skip?: number;
  take?: number;
  targetId?: string;
  userId?: string;
  targetType?: VoteTargetType;
}

@ApiTags('votes')
@Controller('vote')
@ApiBearerAuth('JWT-auth')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get()
  @ApiOperation({ summary: 'Get all votes with optional filters' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of votes to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of votes to take',
  })
  @ApiQuery({
    name: 'targetId',
    required: false,
    type: String,
    description: 'Filter by target ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'targetType',
    required: false,
    enum: VoteValue,
    description: 'Filter by comment, post',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of votes with total count',
    schema: {
      type: 'object',
      properties: {
        votes: {
          type: 'array',
          items: { $ref: '#/components/schemas/Vote' },
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
    @Query('targetId') targetId?: string,
    @Query('userId') userId?: string,
    @Query('targetType') targetType?: VoteTargetType,
  ): Promise<{ votes: Vote[]; total: number }> {
    const options: FindAllOptions = {
      skip,
      take,
      targetId,
      userId,
      targetType,
    };
    return await this.voteService.findAll(options);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new vote' })
  @ApiResponse({
    status: 201,
    description: 'Vote created successfully',
    type: Vote,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({
    status: 409,
    description: 'User has already voted on this post',
  })
  async create(
    @Body() createVoteDto: CreateVoteDto,
    @Request() req: RequestWithUser,
  ): Promise<Vote> {
    return await this.voteService.create(createVoteDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Remove a vote' })
  @ApiResponse({ status: 200, description: 'Vote removed successfully' })
  @ApiResponse({ status: 404, description: 'Vote not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to remove this vote',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    await this.voteService.remove(id, req.user.sub);
  }
}
