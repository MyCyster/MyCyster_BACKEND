import { Module } from '@nestjs/common';
import { AffirmationController } from './affirmation.controller';
import { AffirmationService } from './affirmation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affirmation } from './entities/affirmation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affirmation])],
  controllers: [AffirmationController],
  providers: [AffirmationService],
  exports: [AffirmationService],
})
export class AffirmationModule {}
