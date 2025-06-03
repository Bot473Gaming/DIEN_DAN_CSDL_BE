import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/common/interfaces/base-entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('user')
export class User implements BaseEntity {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'User ID' })
  _id: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Username' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  username: string;

  @Column()
  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Column()
  @ApiProperty({ description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
