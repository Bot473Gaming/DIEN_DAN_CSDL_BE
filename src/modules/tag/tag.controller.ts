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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
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
import { Tag } from './entities/tag.entity';

@ApiTags('tags')
@Controller('tag')
@ApiBearerAuth('JWT-auth')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags with optional filters' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of tags to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of tags to take',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in name and description',
  })
  @ApiResponse({
    status: 200,
    description: 'Return list of tags with total count',
    schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { $ref: '#/components/schemas/Tag' },
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
    @Query('search') search?: string,
  ): Promise<{ tags: Tag[]; total: number }> {
    const options = {
      skip,
      take,
      search,
    };
    return await this.tagService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return tag details',
    type: Tag,
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: string): Promise<Tag> {
    return await this.tagService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new tag (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Tag created successfully',
    type: Tag,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagService.create(createTagDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a tag (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
    type: Tag,
  })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return await this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a tag (Admin only)' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.tagService.remove(id);
  }
}
