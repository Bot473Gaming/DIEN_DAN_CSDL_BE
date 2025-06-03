import {
  Injectable,
  // NotFoundException,
  // BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportService: Repository<Report>,
  ) {}

  // async findAll(): Promise<User[]> {
  //   return this.userRepository.find();
  // }
  // // Get one user by ID, username, or email
  // async findOne(identifier: string): Promise<User> {
  //   const user = await this.userRepository.findOne({
  //     where: [{ _id: identifier }, { username: identifier }],
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return user;
  // }
  // // Create a new user
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   // Check if username exists
  //   const existingUsername = await this.userRepository.findOne({
  //     where: { username: createUserDto.username },
  //   });
  //   if (existingUsername) {
  //     throw new BadRequestException('Username already exists');
  //   }

  //   // Check if email exists
  //   const existingEmail = await this.userRepository.findOne({
  //     where: { email: createUserDto.email },
  //   });
  //   if (existingEmail) {
  //     throw new BadRequestException('Email already exists');
  //   }

  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  //   const user = this.userRepository.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });

  //   return this.userRepository.save(user);
  // }
  // // Update a user by ID
  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.findOne(id);

  //   // Only update password and fullname
  //   if (updateUserDto.password) {
  //     user.password = await bcrypt.hash(updateUserDto.password, 10);
  //   }
  //   if (updateUserDto.fullname) {
  //     user.fullname = updateUserDto.fullname;
  //   }

  //   return this.userRepository.save(user);
  // }
  // async remove(id: string): Promise<void> {
  //   const user = await this.findOne(id);
  //   await this.userRepository.remove(user);
  // }
}
