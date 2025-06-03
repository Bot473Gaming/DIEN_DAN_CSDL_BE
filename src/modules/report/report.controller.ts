import { Controller } from '@nestjs/common';
import { ReportService } from './report.service';
// import { Category } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // /**
  //  * Get all users
  //  *
  //  * @remarks This operation retrieves a list of all users in the system.
  //  *
  //  * @throws {404} No users found in the system.
  //  * @throws {500} Internal server error occurred.
  //  */
  // @NoAuth()
  // @Get()
  // async findAll(): Promise<User[]> {
  //   return await this.userService.findAll();
  // }

  // @Get('profile')
  // getProfile(@Request() req: RequestWithUser) {
  //   return req.user;
  // }

  // /**
  //  * Get user by ID
  //  *
  //  * @remarks This operation retrieves a specific user by their unique identifier.
  //  *
  //  * @throws {404} User with the specified ID was not found.
  //  * @throws {400} Invalid ID format provided.
  //  */
  // @NoAuth()
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<User> {
  //   return await this.userService.findOne(id);
  // }

  // /**
  //  * Create a new user
  //  *
  //  * @remarks This operation allows you to create a new user in the system.
  //  *
  //  * @throws {400} Bad request - Invalid user data provided.
  //  */
  // @Roles(UserRole.ADMIN)
  // @Post()
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return await this.userService.create(createUserDto);
  // }

  // /**
  //  * Update user by ID
  //  *
  //  * @remarks This operation allows you to update an existing user's information.
  //  *
  //  * @throws {404} User with the specified ID was not found.
  //  * @throws {400} Invalid ID format or update data provided.
  //  */
  // @Roles(UserRole.ADMIN)
  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   return await this.userService.update(id, updateUserDto);
  // }

  // /**
  //  * Delete user by ID
  //  *
  //  * @remarks This operation permanently removes a user from the system.
  //  *
  //  * @throws {404} User with the specified ID was not found.
  //  * @throws {400} Invalid ID format provided.
  //  */
  // @Roles(UserRole.ADMIN)
  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<void> {
  //   await this.userService.remove(id);
  // }
}
