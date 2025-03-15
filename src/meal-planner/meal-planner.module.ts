import { Module } from '@nestjs/common';
import { MealPlannerService } from './meal-planner.service';
import { MealPlannerController } from './meal-planner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlan } from './entities/meal-planner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlan])],
  controllers: [MealPlannerController],
  providers: [MealPlannerService],
  exports: [MealPlannerService]
})
export class MealPlannerModule {}
