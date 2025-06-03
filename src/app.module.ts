import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { VoteModule } from './modules/vote/vote.module';
import { TagModule } from './modules/tag/tag.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReportModule } from './modules/report/report.module';
import { ConfigModule } from '@nestjs/config';
import { seedAdminUser } from './config/seed';
import { DataSource } from 'typeorm';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
    CommentModule,
    VoteModule,
    TagModule,
    NotificationModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    seedAdminUser(dataSource).catch((err) => {
      console.error('Error seeding admin user:', err);
    });
  }
}
