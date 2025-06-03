import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vote } from './entities/vote.entity';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
// import { AuthGuard } from '../../common/guards/auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  controllers: [VoteController],
  providers: [JwtService, VoteService],
  exports: [VoteService],
})
export class VoteModule {}
