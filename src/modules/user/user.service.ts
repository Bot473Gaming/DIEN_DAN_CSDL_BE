import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {
    void this.initProfile();
  }

  async initProfile(): Promise<void> {
    const users = await this.userRepository.find({ select: { _id: true } });
    const existingProfiles = await this.userProfileRepository.find({
      select: { userId: true },
    });
    // console.log('Initializing user profiles for existing users:', users);
    for (const user of users) {
      if (existingProfiles.some((profile) => profile.userId === user._id)) {
        continue;
      }
      await this.userProfileRepository.save({
        userId: user._id,
        cover: '',
        bio: '',
      });
    }
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  // Get one user by ID, username, or email
  async findOne(identifier: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { _id: identifier },
        select: {
          _id: true,
          email: true,
          username: true,
          password: true,
          fullname: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    // Check if email exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.USER,
    });
    await this.userProfileRepository.save({
      userId: user._id,
      cover: '',
      bio: '',
    });

    return this.userRepository.save(user);
  }
  // Update a user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Only update password and fullname
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.fullname) {
      user.fullname = updateUserDto.fullname;
    }

    return this.userRepository.save(user);
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // getUserProfile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfileRepository.findOne({ where: { userId } });
  }

  // updateUserProfile
  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateUserProfileDto,
  ): Promise<User> {
    const { user, profile } = updateProfileDto;
    await this.update(userId, user as UpdateUserDto);
    await this.userProfileRepository.save({ ...profile, userId });
    return this.findOne(userId);
  }
}
