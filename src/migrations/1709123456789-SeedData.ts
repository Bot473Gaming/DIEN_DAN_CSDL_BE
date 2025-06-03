import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedData1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert users
    await queryRunner.query(`
      INSERT INTO "user" ("_id", "email", "username", "password", "fullname", "role") VALUES
      ('a9ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'admin@ptit.edu.vn', 'admin', '${hashedPassword}', 'Administrator', 'admin'),
      ('b8ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'user1@ptit.edu.vn', 'user1', '${hashedPassword}', 'User One', 'user'),
      ('c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'user2@ptit.edu.vn', 'user2', '${hashedPassword}', 'User Two', 'user'),
      ('d6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'user3@ptit.edu.vn', 'user3', '${hashedPassword}', 'User Three', 'user'),
      ('e5ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'user4@ptit.edu.vn', 'user4', '${hashedPassword}', 'User Four', 'user'),
      ('f4ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'user5@ptit.edu.vn', 'user5', '${hashedPassword}', 'User Five', 'user'),
      ('g3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'user6@ptit.edu.vn', 'user6', '${hashedPassword}', 'User Six', 'user'),
      ('h2ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'user7@ptit.edu.vn', 'user7', '${hashedPassword}', 'User Seven', 'user'),
      ('i1ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'user8@ptit.edu.vn', 'user8', '${hashedPassword}', 'User Eight', 'user'),
      ('j0ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'user9@ptit.edu.vn', 'user9', '${hashedPassword}', 'User Nine', 'user');
    `);

    // Insert categories
    await queryRunner.query(`
      INSERT INTO "category" ("_id", "name") VALUES
      ('c1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'Technology'),
      ('c2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'Programming'),
      ('c3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'Web Development'),
      ('c4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'Mobile Development'),
      ('c5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'Database');
    `);

    // Insert tags
    await queryRunner.query(`
      INSERT INTO "tag" ("_id", "tagName", "description") VALUES
      ('t1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'javascript', 'JavaScript programming language'),
      ('t2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'typescript', 'TypeScript programming language'),
      ('t3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'nodejs', 'Node.js runtime environment'),
      ('t4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'react', 'React JavaScript library'),
      ('t5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'nestjs', 'NestJS framework'),
      ('t6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'mongodb', 'MongoDB database'),
      ('t7ca66b9-47b4-4d2b-aa07-f0d61fe3129g', 'postgresql', 'PostgreSQL database');
    `);

    // Insert posts
    await queryRunner.query(`
      INSERT INTO "post" ("_id", "title", "content", "userId", "categoryId", "isLocked", "createdAt", "updatedAt") VALUES
      ('p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'Getting Started with NestJS', 'This is a comprehensive guide to NestJS...', 'b8ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'c3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', false, NOW(), NOW()),
      ('p2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'TypeScript Best Practices', 'Learn the best practices for TypeScript...', 'c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'c2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', false, NOW(), NOW()),
      ('p3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'React Hooks Tutorial', 'A deep dive into React Hooks...', 'd6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'c3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', false, NOW(), NOW()),
      ('p4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'MongoDB vs PostgreSQL', 'Comparing MongoDB and PostgreSQL...', 'e5ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'c5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', false, NOW(), NOW()),
      ('p5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'Mobile App Development Tips', 'Essential tips for mobile development...', 'f4ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'c4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', false, NOW(), NOW());
    `);

    // Insert post_tag relationships
    await queryRunner.query(`
      INSERT INTO "post_tag" ("postId", "tagId") VALUES
      ('p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 't5ca66b9-47b4-4d2b-aa07-f0d61fe3129e'),
      ('p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 't2ca66b9-47b4-4d2b-aa07-f0d61fe3129b'),
      ('p2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 't2ca66b9-47b4-4d2b-aa07-f0d61fe3129b'),
      ('p3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 't4ca66b9-47b4-4d2b-aa07-f0d61fe3129d'),
      ('p4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 't6ca66b9-47b4-4d2b-aa07-f0d61fe3129f'),
      ('p4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 't7ca66b9-47b4-4d2b-aa07-f0d61fe3129g');
    `);

    // Insert comments
    await queryRunner.query(`
      INSERT INTO "comment" ("_id", "postId", "userId", "content", "parentCommentId", "createdAt", "updatedAt") VALUES
      ('cm1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'Great tutorial!', null, NOW(), NOW()),
      ('cm2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'd6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'Thanks for sharing!', 'cm1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', NOW(), NOW()),
      ('cm3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'p2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'e5ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'Very helpful!', null, NOW(), NOW()),
      ('cm4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'p3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'f4ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'Nice explanation!', null, NOW(), NOW()),
      ('cm5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'p4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'g3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'Good comparison!', null, NOW(), NOW());
    `);

    // Insert votes
    await queryRunner.query(`
      INSERT INTO "vote" ("_id", "userId", "targetType", "targetId", "voteValue", "createdAt") VALUES
      ('v1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'POST', 'p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'UPVOTE', NOW()),
      ('v2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'd6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'POST', 'p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'UPVOTE', NOW()),
      ('v3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'e5ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'COMMENT', 'cm1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'UPVOTE', NOW()),
      ('v4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'f4ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'POST', 'p2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'DOWNVOTE', NOW()),
      ('v5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'g3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'COMMENT', 'cm3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'UPVOTE', NOW());
    `);

    // Insert notifications
    await queryRunner.query(`
      INSERT INTO "notification" ("_id", "userId", "type", "content", "isRead", "createdAt") VALUES
      ('n1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'b8ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'POST_CREATED', 'Your post has been created successfully', false, NOW()),
      ('n2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'COMMENT_CREATED', 'Someone commented on your post', false, NOW()),
      ('n3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'd6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'POST_LOCKED', 'Your post has been locked by admin', true, NOW()),
      ('n4ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'e5ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'REPORT_CREATED', 'A new report has been created', false, NOW()),
      ('n5ca66b9-47b4-4d2b-aa07-f0d61fe3129e', 'f4ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'REPORT_RESOLVED', 'Your report has been resolved', true, NOW());
    `);

    // Insert reports
    await queryRunner.query(`
      INSERT INTO "report" ("_id", "userId", "postId", "commentId", "reason", "status", "createdAt") VALUES
      ('r1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'b8ca66b9-47b4-4d2b-aa07-f0d61fe3129d', 'p1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', null, 'Inappropriate content', 'PENDING', NOW()),
      ('r2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', 'c7ca66b9-47b4-4d2b-aa07-f0d61fe3129e', null, 'cm1ca66b9-47b4-4d2b-aa07-f0d61fe3129a', 'Spam comment', 'RESOLVED', NOW()),
      ('r3ca66b9-47b4-4d2b-aa07-f0d61fe3129c', 'd6ca66b9-47b4-4d2b-aa07-f0d61fe3129f', 'p2ca66b9-47b4-4d2b-aa07-f0d61fe3129b', null, 'Offensive language', 'REJECTED', NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse order to handle foreign key constraints
    await queryRunner.query(`DELETE FROM "report"`);
    await queryRunner.query(`DELETE FROM "notification"`);
    await queryRunner.query(`DELETE FROM "vote"`);
    await queryRunner.query(`DELETE FROM "comment"`);
    await queryRunner.query(`DELETE FROM "post_tag"`);
    await queryRunner.query(`DELETE FROM "post"`);
    await queryRunner.query(`DELETE FROM "tag"`);
    await queryRunner.query(`DELETE FROM "category"`);
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
