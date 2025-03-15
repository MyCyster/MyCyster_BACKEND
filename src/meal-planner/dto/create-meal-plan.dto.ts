import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMealPlanDto {
  @ApiProperty({ description: 'Meal Type', example: ['Breakfast'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  meal_types: string[]; // Now allows multiple meal types

  @ApiProperty({ description: 'Day Count', example: 1 })
  @IsNotEmpty()
  @IsInt()
  days_count: number;

  @ApiProperty({ description: 'Calorie goal', example: 500 })
  @IsNotEmpty()
  @IsInt()
  @IsInt()
  calorie_goal?: number;

  @ApiProperty({ description: 'Protein goal', example: 50 })
  @IsNotEmpty()
  @IsInt()
  protein: number;

  @ApiProperty({ description: 'Carbohydrate goal', example: 50 })
  @IsNotEmpty()
  @IsInt()
  @IsInt()
  carbohydrates: number;

  @ApiProperty({ description: 'Fat Goal', example: 50 })
  @IsNotEmpty()
  @IsInt()
  @IsInt()
  fats: number;

  @ApiPropertyOptional({
    description: 'Dietary Restriction',
    example: 'Vegetarian',
  })
  @IsOptional()
  @IsString()
  dietary_restrictions?: string;
}
