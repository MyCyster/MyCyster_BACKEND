import { Test, TestingModule } from '@nestjs/testing';
import { MoodTrackerService } from './mood-tracker.service';
import { MoodTrackerController } from './mood-tracker.controller';

describe('MoodTrackerController', () => {
    let controller: MoodTrackerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoodTrackerController],
            providers: [MoodTrackerService],
        }).compile();

        controller = module.get<MoodTrackerController>(MoodTrackerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});