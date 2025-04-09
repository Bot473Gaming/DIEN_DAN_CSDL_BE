import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // Create a new user
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = CreateUserDto;
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        username: CreateUserDto.username,
        email: CreateUserDto.email,
      },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // Get one user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  async update(id: number, UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    // Hash the password if it is updated
    if (UpdateUserDto.password) {
      UpdateUserDto.password = await bcrypt.hash(UpdateUserDto.password, 10);
    }
    // Update the user
    await this.userRepository.update(id, UpdateUserDto);
    return this.findOne(id);
  }
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    // Delete the user
    await this.userRepository.delete(id);
  }
}
