import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateImageDto } from './dto/update-user-profile-picture.dto';
import { AffirmationService } from '../affirmation/affirmation.service';
import { MoodTrackerService } from '../mood-tracker/mood-tracker.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly affirmationService: AffirmationService,
    private readonly moodTrackerService: MoodTrackerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('home')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get User Data for Home Page' })
  @ApiOkResponse({ description: 'Data retrieved successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getUserData(@Request() req: any) {
    try {
      const userId = req.user.id;
      const { data: affirmation } =
        await this.affirmationService.getAffirmationForUser(userId);
      const data =
        await this.moodTrackerService.getMostFrequentMoodPercentage(userId);
      const mostFrequentMood = data.data ? data.data : data.message;
      const calories = 2200;
      return {
        message: 'Data retrieved successfully',
        data: { affirmation, mostFrequentMood, calories },
      };
    } catch (error) {
      console.log('error', error);
      this.logger.error(error.message);
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    try {
      return this.userService.getUserProfile(req.user.id);
    } catch (error) {
      console.log('error', error);
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ description: 'Profile updated successfully' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'Current password is incorrect or required',
  })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      return this.userService.updateProfile(req.user.id, updateProfileDto);
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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

  @Patch('profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiOkResponse({ description: 'Profile picture updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'Current password is incorrect or required',
  })
  @HttpCode(HttpStatus.OK)
  async updateProfilePicture(
    @Request() req,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    try {
      return this.userService.editProfilePicture(req.user.id, updateImageDto);
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
