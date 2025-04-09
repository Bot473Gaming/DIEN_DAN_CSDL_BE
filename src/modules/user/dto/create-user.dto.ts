import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullname: string;
}
