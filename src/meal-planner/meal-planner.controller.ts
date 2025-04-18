import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ConflictException,
  BadRequestException,
  HttpException,
  Query,
  Get,
} from '@nestjs/common';
import { MealPlannerService } from './meal-planner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlannerController {
  constructor(private readonly mealPlannerService: MealPlannerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Meal Planner' })
  @ApiCreatedResponse({ description: 'Meal Plan created successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async createMealPlan(
    @Request() req: any,
    @Body() createMealPlanDto: CreateMealPlanDto,
  ) {
    try {
      const user = req.user.id;
      return this.mealPlannerService.createMealPlan(user, createMealPlanDto);
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All Meal Plans' })
  @ApiOkResponse({ description: 'Meal Plans fetched successfully' })
  async getMealPlans(@Request() req) {
    try {
      const user = req.user.id;

      return this.mealPlannerService.getMealPlans(user);
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('nutrient-summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Nutrient Summary' })
  @ApiOkResponse({ description: 'Nutrient Summary fetched successfully' })
  async getNutrientSummary(@Request() req) {
    try {
      const user = req.user.id;

      return this.mealPlannerService.getNutrientSummary(user);
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

}
