import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodTrackerService } from 'src/mood-tracker/mood-tracker.service';
import { AffirmationService } from 'src/affirmation/affirmation.service';
import { MoodTrackerModule } from 'src/mood-tracker/mood-tracker.module';
import { AffirmationModule } from 'src/affirmation/affirmation.module';
import { Mood } from 'src/mood-tracker/entities/mood.entity';
import { Affirmation } from 'src/affirmation/entities/affirmation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Mood]),
    TypeOrmModule.forFeature([Affirmation]),
    forwardRef(() => MoodTrackerModule),
    forwardRef(() => AffirmationModule),
  ],
  controllers: [UserController],
  providers: [UserService, MoodTrackerService, AffirmationService],
  exports: [UserService],
})
export class UserModule {}
