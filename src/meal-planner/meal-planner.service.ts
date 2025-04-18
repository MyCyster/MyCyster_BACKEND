import { Injectable, NotFoundException } from '@nestjs/common';
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
      meal_type,

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
      meal_type,

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
  async getMealPlans(user) {
    const query = this.mealPlanRepository.createQueryBuilder('meal_plan');

    // Filter by user
    query.where('meal_plan.user = :user_id', { user_id: user });

    // If mealTypes is provided, filter by the selected meal types
    // Fetch meal plans with the filtering conditions applied
    const mealPlans = await query.getMany();

    return {
      message: 'Meal Plans fetched successfully',
      mealPlans,
    };
  }

  async getAverageCalorieGoal(userId: string) {
    const result = await this.mealPlanRepository
      .createQueryBuilder('meal_plan')
      .select('AVG(meal_plan.calorie_goal)', 'average')
      .where('meal_plan.user_id = :userId', { userId })
      .andWhere('meal_plan.calorie_goal IS NOT NULL')
      .getRawOne();

    return result?.average || 0;
  }

  async getNutrientSummary(userId: string) {
    const plans = await this.mealPlanRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      take: 1,
    });

    if (!plans || plans.length === 0) {
      throw new NotFoundException('No meal plans found for this user');
    }

    const currentPlan = plans[0];
    // Calculate calories from grams
    const proteinCalories = currentPlan.protein * 4;
    const carbsCalories = currentPlan.carbohydrates * 4;
    const fatsCalories = currentPlan.fats * 9;
    const totalCalorieIntake = proteinCalories + carbsCalories + fatsCalories;
    const calorieIntakePercentage = Math.round(
      (totalCalorieIntake / currentPlan.calorie_goal) * 100
    );

    return {
      calorie_goal: currentPlan.calorie_goal,
      protein: Math.round((proteinCalories / totalCalorieIntake) * 100),
      carbohydrates: Math.round((carbsCalories / totalCalorieIntake) * 100),
      fats: Math.round((fatsCalories / totalCalorieIntake) * 100),
      calorie_intake: calorieIntakePercentage,
    };
  }
}
