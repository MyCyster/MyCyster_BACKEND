import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Mood } from './entities/mood.entity';
import { LogMoodDto } from './dto/log-mood.dto';
import { MoodValue } from 'src/enums/mood.enum';
import * as dayjs from 'dayjs';
import { Parser } from 'json2csv';

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

  async getMostFrequentMoodPercentage(userId: string) {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      const moodLogs = await this.moodRepository.find({
        where: {
          user: { id: userId },
          is_deleted: false,
          created_at: Between(sevenDaysAgo, now),
        },
      });

      if (moodLogs.length === 0) {
        return {
          message: 'No mood data found for the last 7 days.',
        };
      }

      const moodCountMap: Record<string, number> = {};

      moodLogs.forEach((log) => {
        const mood = log.mood;

        if (!moodCountMap[mood]) {
          moodCountMap[mood] = 1;
        } else {
          moodCountMap[mood] += 1;
        }
      });

      const totalLogs = moodLogs.length;
      const moodPercentages: { mood: string; percentage: number }[] = [];

      for (const mood in moodCountMap) {
        const count = moodCountMap[mood];
        const percentage = (count / totalLogs) * 100;

        moodPercentages.push({
          mood,
          percentage: parseFloat(percentage.toFixed(2)),
        });
      }

      const mostFrequentMood = moodPercentages.reduce((prev, current) =>
        prev.percentage > current.percentage ? prev : current,
      );
      this.logger.log('Most frequent mood fetched successfully');
      return {
        message: 'Most frequent mood fetched successfully',
        data: mostFrequentMood,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async downloadMoodHistory(
    userId: string,
    filters: { startDate?: string; endDate?: string },
  ) {
    const where: any = {
      user: { id: userId },
      is_deleted: false,
    };

    if (filters.startDate && filters.endDate) {
      const start = dayjs(filters.startDate);
      const end = dayjs(filters.endDate);

      if (!start.isValid() || !end.isValid()) {
        this.logger.error('Invalid date format.');
        throw new BadRequestException('Invalid date format.');
      }

      if (end.isBefore(start)) {
        this.logger.error('End date must be after start date.');
        throw new BadRequestException('End date must be after start date.');
      }

      where.created_at = Between(start.toDate(), end.toDate());
    } else if (filters.startDate && !filters.endDate) {
      const start = dayjs(filters.startDate);
      if (!start.isValid()) {
        this.logger.error('Invalid start date');
        throw new BadRequestException('Invalid start date.');
      }

      const now = dayjs();
      where.created_at = Between(start.toDate(), now.toDate());
    }

    const moods = await this.moodRepository.find({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    if (moods.length === 0) {
      this.logger.log('No mood data found');
      return {
        message: 'No mood data found',
      };
    }

    const formatted = moods.map((mood) => ({
      ID: mood.id,
      Mood: mood.mood,
      Description: mood.description,
      Date: dayjs(mood.created_at).format('YYYY-MM-DD HH:mm:ss'),
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);
    this.logger.log('Mood history Csv generated');
    return Buffer.from(csv);
  }

  async getMoodStats(userId: string) {
    const moodCounts = Object.values(MoodValue).reduce(
      (acc, mood) => {
        acc[mood] = 0;
        return acc;
      },
      {} as Record<MoodValue, number>,
    );

    const moods = await this.moodRepository.find({
      where: {
        user: { id: userId },
        is_deleted: false,
      },
      select: ['mood'],
    });

    for (const moodEntry of moods) {
      moodCounts[moodEntry.mood]++;
    }

    return {
      message: 'Mood stats fetched succesfully',
      data: moodCounts,
    };
  }
}
