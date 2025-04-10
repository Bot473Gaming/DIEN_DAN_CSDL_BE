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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   *
   * @remarks This operation retrieves a list of all users in the system.
   *
   * @throws {404} No users found in the system.
   * @throws {500} Internal server error occurred.
   */
  @Get()
  async findAll(): Promise<Response<User[]>> {
    const users = await this.userService.findAll();
    return {
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  /**
   * Get user by ID
   *
   * @remarks This operation retrieves a specific user by their unique identifier.
   *
   * @throws {404} User with the specified ID was not found.
   * @throws {400} Invalid ID format provided.
   */
  @Get(':id')
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

  /**
   * Create a new user
   *
   * @remarks This operation allows you to create a new user in the system.
   *
   * @throws {400} Bad request - Invalid user data provided.
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.userService.create(createUserDto);
    return {
      status: true,
      message: 'User created successfully',
      data: user,
    };
  }

  /**
   * Update user by ID
   *
   * @remarks This operation allows you to update an existing user's information.
   *
   * @throws {404} User with the specified ID was not found.
   * @throws {400} Invalid ID format or update data provided.
   */
  @Put(':id')
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

  /**
   * Delete user by ID
   *
   * @remarks This operation permanently removes a user from the system.
   *
   * @throws {404} User with the specified ID was not found.
   * @throws {400} Invalid ID format provided.
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Response<void>> {
    await this.userService.remove(id);
    return {
      status: true,
      message: 'User deleted successfully',
    };
  }
}
