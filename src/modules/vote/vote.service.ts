import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteTargetType, VoteValue } from '../../common/enums/vote.enum';

interface FindAllOptions {
  skip?: number;
  take?: number;
  postId?: string;
  userId?: string;
  type?: VoteValue;
}

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async findAll(
    options: FindAllOptions,
  ): Promise<{ votes: Vote[]; total: number }> {
    const { skip = 0, take = 10, postId, userId, type } = options;

    const queryBuilder = this.voteRepository
      .createQueryBuilder('vote')
      .leftJoinAndSelect('vote.user', 'user')
      .leftJoinAndSelect('vote.post', 'post')
      .leftJoinAndSelect('vote.comment', 'comment');

    if (postId) {
      queryBuilder.andWhere(
        'vote.targetId = :postId AND vote.targetType = :postType',
        {
          postId,
          postType: VoteTargetType.POST,
        },
      );
    }

    if (userId) {
      queryBuilder.andWhere('vote.userId = :userId', { userId });
    }

    if (type) {
      queryBuilder.andWhere('vote.voteValue = :type', { type });
    }

    const [votes, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('vote.createdAt', 'DESC')
      .getManyAndCount();

    return { votes, total };
  }

  async create(createVoteDto: CreateVoteDto, userId: string): Promise<Vote> {
    const { targetId, targetType, voteValue } = createVoteDto;

    // Check if user has already voted on this target
    const existingVote = await this.voteRepository.findOne({
      where: {
        userId,
        targetId,
        targetType,
      },
    });

    if (existingVote) {
      if (existingVote.voteValue === voteValue) {
        throw new BadRequestException('You have already voted on this target');
      }
      // If vote type is different, update the existing vote
      existingVote.voteValue = voteValue;
      return this.voteRepository.save(existingVote);
    }

    const vote = this.voteRepository.create({
      ...createVoteDto,
      userId,
    });

    return this.voteRepository.save(vote);
  }

  async remove(id: string, userId: string): Promise<void> {
    const vote = await this.voteRepository.findOne({
      where: { _id: id },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    if (vote.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to remove this vote',
      );
    }

    await this.voteRepository.remove(vote);
  }
}
