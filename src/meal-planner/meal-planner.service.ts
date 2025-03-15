import { Injectable } from '@nestjs/common';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { MealPlan } from './entities/meal-planner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MealPlannerService {
  private readonly ALL_MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  constructor(
    @InjectRepository(MealPlan)
    private readonly mealPlanRepository: Repository<MealPlan>,

    // @InjectRepository(Food)
    // private readonly foodRepository: Repository<Food>,
  ) {}
  async createMealPlan(user, createMealPlanDto: CreateMealPlanDto) {
    const {
      meal_types,

      days_count,

      calorie_goal,

      protein,

      carbohydrates,

      fats,
      dietary_restrictions,
    } = createMealPlanDto;

    // If "Select all options" is included, override mealTypes with all options
    // if (meal_types.includes('Select all options')) {
    //   meal_types = this.ALL_MEAL_TYPES;
    // }

    // // Find foods that match meal types and dietary restrictions
    // let foodQuery = this.foodRepository
    //   .createQueryBuilder('food')
    //   .where('food.meal_type IN (:...mealTypes)', { meal_types });

    // if (dietaryRestrictions) {
    //   foodQuery = foodQuery.andWhere('LOWER(food.name) NOT LIKE :restriction', {
    //     restriction: `%${dietaryRestrictions.toLowerCase()}%`,
    //   });
    // }

    // const suggestedFoods = await foodQuery.getMany();

    // const mealPlan = this.mealPlanRepository.create({
    //   user,
    //   mealTypes,
    //   duration,
    //   calorieGoal,
    //   macronutrients,
    //   dietaryRestrictions,
    //   selectedFoods: suggestedFoods, // Attach selected foods
    // });

    const mealPlan = this.mealPlanRepository.create({
      user: { id: user },
      meal_types,

      days_count,

      calorie_goal,

      protein,

      carbohydrates,

      fats,
      dietary_restrictions,
      // selectedFoods: suggestedFoods, // Attach selected foods
    });
    await this.mealPlanRepository.save(mealPlan);

    return {
      message: 'Meal Plan created successfully',
      data: mealPlan,
    };
  }
  async getMealPlans(user, mealTypes?: string[]) {
    const query = this.mealPlanRepository.createQueryBuilder('meal_plan');

    // Filter by user
    query.where('meal_plan.user = :user_id', { user_id: user });

    // If mealTypes is provided, filter by the selected meal types
    if (mealTypes && mealTypes.length > 0) {
      query.andWhere('meal_plan.meal_types && :mealTypes', {
        mealTypes: mealTypes,
      });
    }

    // Fetch meal plans with the filtering conditions applied
    const mealPlans = await query.getMany();

    return {
      message: 'Meal Plans fetched successfully',
      mealPlans,
    };
  }
}
