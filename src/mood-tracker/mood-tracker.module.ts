import { Module } from '@nestjs/common';
import { MoodTrackerService } from './mood-tracker.service';
import { MoodTrackerController } from './mood-tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mood } from './entities/mood.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mood])],
    controllers: [MoodTrackerController],
    providers: [MoodTrackerService],
    exports: [MoodTrackerService],
})
export class MoodTrackerModule {}