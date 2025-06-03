import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
// import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { BaseEntity } from 'src/common/interfaces/base-entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category implements BaseEntity {
  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;
}
