import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';

// import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // MulterModule.register({
    //   dest: './upload',
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
