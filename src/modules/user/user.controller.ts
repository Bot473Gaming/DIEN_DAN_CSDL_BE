import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequestWithUser } from '../auth/common/request-with-user.interface';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
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
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  /**
   * Create a new user
   *
   * @remarks This operation allows you to create a new user in the system.
   *
   * @throws {400} Bad request - Invalid user data provided.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  /**
   * Update user by ID
   *
   * @remarks This operation allows you to update an existing user's information.
   *
   * @throws {404} User with the specified ID was not found.
   * @throws {400} Invalid ID format or update data provided.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  /**
   * Delete user by ID
   *
   * @remarks This operation permanently removes a user from the system.
   *
   * @throws {404} User with the specified ID was not found.
   * @throws {400} Invalid ID format provided.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.remove(id);
  }
}
