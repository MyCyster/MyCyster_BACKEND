import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Affirmation } from './entities/affirmation.entity';
import { CreateAffirmationDto } from './dto/affirmation.dto';

@Injectable()
export class AffirmationService {
  private readonly logger = new Logger(AffirmationService.name);
  constructor(
    @InjectRepository(Affirmation)
    private readonly affirmationRepository: Repository<Affirmation>,
  ) {}

  async createAffirmations(payload: CreateAffirmationDto) {
    const affirmations = this.affirmationRepository.create(
      payload.affirmations.map((affirmation) => ({
        affirmation: affirmation,
      })),
    );
    await this.affirmationRepository.save(affirmations);
    this.logger.log('Affirmations created successfully');
    return { message: 'Affirmations created successfully', data: affirmations };
  }

  seededRandom(seed: number) {
    const m = 2 ** 31;
    const a = 1103515245;
    const c = 12345;

    let state = seed % m;

    return function () {
      state = (a * state + c) % m;
      return state / m;
    };
  }

  async getAffirmationForUser(userId: string) {
    const affirmations = await this.affirmationRepository.find();

    if (!affirmations.length) {
      throw new BadRequestException('No affirmations found in the database.');
    }
    const referenceDate = new Date('2025-03-01T00:00:00Z');
    const today = new Date();

    const diffInMs = today.getTime() - referenceDate.getTime();
    const weeksPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const userHash = [...userId].reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    const combinedSeed = weeksPassed + userHash;

    const random = this.seededRandom(combinedSeed);

    const index = Math.floor(random() * affirmations.length);
    this.logger.log('Affirmation fetched successfully');
    return {
      message: 'Affirmation fetched successfully',
      data: affirmations[index],
    };
  }
}
