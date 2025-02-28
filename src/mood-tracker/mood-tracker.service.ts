import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Mood } from './entities/mood.entity';
import { LogMoodDto } from './dto/log-mood.dto';
import { MoodValue } from 'src/enums/mood.enum';

@Injectable()
export class MoodTrackerService {
  private readonly logger = new Logger(MoodTrackerService.name);
  constructor(
    @InjectRepository(Mood)
    private readonly moodRepository: Repository<Mood>,
  ) {}

  async logMood(data: LogMoodDto, userId: string) {
    const { mood, description } = data;
    if (!Object.values(MoodValue).includes(mood)) {
      this.logger.error(`${mood} is not a valid mood value`);
      throw new BadRequestException(`${mood} is not a valid mood value`);
    }
    const newMood = this.moodRepository.create({
      mood: mood,
      description,
      user: { id: userId },
    });
    await this.moodRepository.save(newMood);
    this.logger.log('Mood logged successfully');
    return {
      message: 'Mood logged successfully',
      data: newMood,
    };
  }

  async getMoodHistory(
    userId: string,
    filters: { moodValue?: MoodValue; startDate?: string; endDate?: string },
  ) {
    const { moodValue, startDate, endDate } = filters;
    const newStartDate = startDate ? new Date(startDate) : null;
    const newEndDate = endDate ? new Date(endDate) : null;

    const queryBuilder = this.moodRepository
      .createQueryBuilder('mood')
      .where('mood.user = :userId', { userId });

    if (moodValue) {
      queryBuilder.andWhere('mood.mood = :moodValue', { moodValue });
    }

    if (startDate) {
      queryBuilder.andWhere('mood.created_at >= :newStartDate', {
        newStartDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere('mood.created_at <= :newEndDate', { newEndDate });
    }

    queryBuilder.orderBy('mood.created_at', 'DESC');

    const moodHistory = await queryBuilder.getMany();
    this.logger.log('Mood history fetched successfully');
    return {
      message: 'Mood history fetched successfully',
      data: moodHistory,
    };
  }

  async getMoodHistoryById(moodId: string) {
    const mood = await this.moodRepository.findOne({
      where: { id: moodId },
    });
    if (!mood) {
      this.logger.error('Mood not found');
      throw new NotFoundException('Mood not found');
    }
    this.logger.log('Mood history fetched successfully by ID');
    return {
      message: 'Mood history fetched successfully',
      data: mood,
    };
  }
}
