import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from './common/response.type';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<Response<User[]>> {
    const users = await this.userService.findAll();
    return {
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<User>> {
    const user = await this.userService.findOne(id);
    return {
      status: true,
      message: 'User found successfully',
      data: user,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.userService.create(createUserDto);
    return {
      status: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response<User>> {
    const user = await this.userService.update(id, updateUserDto);
    return {
      status: true,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Response<void>> {
    await this.userService.remove(id);
    return {
      status: true,
      message: 'User deleted successfully',
    };
  }
}
