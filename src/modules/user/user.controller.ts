import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Response } from './common/response.type';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'User list retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  // Get one user by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: number): Promise<Response<User>> {
    try {
      const user = await this.userService.findOne(id);
      return {
        status: true,
        message: 'User found successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  // Create user
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        status: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  // Update user by ID
  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response<User>> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return {
        status: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
  // Delete user by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: number): Promise<Response<User>> {
    try {
      await this.userService.remove(id);
      return {
        status: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
