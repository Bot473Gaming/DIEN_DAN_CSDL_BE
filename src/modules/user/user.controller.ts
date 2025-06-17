import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NoAuth } from '../../common/decorators/no-auth.decorator';
import { RequestWithUser } from '../auth/common/request-with-user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @NoAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return list of users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: RequestWithUser) {
    return this.userService.findOne(req.user.sub);
  }

  @Get(':id')
  @NoAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return user details',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }
  // getUserProfile
  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user.sub, updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({
    status: 200,
    description: 'User account successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteProfile(@Request() req: RequestWithUser) {
    return this.userService.remove(req.user.sub);
  }
  @Put('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateUserProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(req.user.sub, updateProfileDto);
  }
}
