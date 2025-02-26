import { Test, TestingModule } from '@nestjs/testing';
import { MoodTrackerService } from './mood-tracker.service';

describe('MoodTrackerService', () => {
    let service: MoodTrackerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MoodTrackerService],
        }).compile();

        service = module.get<MoodTrackerService>(MoodTrackerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});