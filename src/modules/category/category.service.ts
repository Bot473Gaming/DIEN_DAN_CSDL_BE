import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

interface FindAllOptions {
  skip?: number;
  take?: number;
  search?: string;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    options: FindAllOptions = {},
  ): Promise<{ categories: Category[]; total: number }> {
    const { skip = 0, take = 10, search } = options;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.where('category.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [categories, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { categories, total };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { _id: id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    const { name } = updateCategoryDto;

    if (name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name },
      });

      if (existingCategory && existingCategory._id !== id) {
        throw new BadRequestException('Category with this name already exists');
      }

      category.name = name;
    }

    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
