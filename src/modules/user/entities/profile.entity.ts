import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseEntity } from 'src/common/interfaces/base-entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userProfile')
export class UserProfile implements BaseEntity {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'UserProfile ID' })
  _id: string;
  @Column()
  userId?: string;
  @Column()
  @IsOptional()
  cover?: string;
  @Column()
  @IsOptional()
  bio?: string;
}
