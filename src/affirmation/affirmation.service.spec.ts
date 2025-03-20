import { Test, TestingModule } from '@nestjs/testing';
import { AffirmationService } from './affirmation.service';

describe('AffirmationService', () => {
  let service: AffirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffirmationService],
    }).compile();

    service = module.get<AffirmationService>(AffirmationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
