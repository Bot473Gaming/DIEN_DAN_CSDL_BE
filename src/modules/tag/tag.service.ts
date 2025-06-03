import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

interface FindAllOptions {
  skip?: number;
  take?: number;
  search?: string;
}

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(
    options: FindAllOptions = {},
  ): Promise<{ tags: Tag[]; total: number }> {
    const { skip = 0, take = 10, search } = options;

    const queryBuilder = this.tagRepository.createQueryBuilder('tag');

    if (search) {
      queryBuilder.where(
        '(tag.tagName LIKE :search OR tag.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [tags, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { tags, total };
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { _id: id },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { tagName, description } = createTagDto;
    const existingTag = await this.tagRepository.findOne({
      where: { tagName: tagName },
    });

    if (existingTag) {
      throw new BadRequestException('Tag with this name already exists');
    }

    const tag = this.tagRepository.create({
      tagName: tagName,
      description: description,
    });
    return await this.tagRepository.save(tag);
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    const { tagName, description } = updateTagDto;

    if (tagName) {
      const existingTag = await this.tagRepository.findOne({
        where: { tagName },
      });

      if (existingTag && existingTag._id !== id) {
        throw new BadRequestException('Tag with this name already exists');
      }

      tag.tagName = tagName;
    }

    if (description !== undefined) {
      tag.description = description;
    }

    return await this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
