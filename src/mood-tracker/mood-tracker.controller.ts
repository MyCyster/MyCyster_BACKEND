import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  ConflictException,
  HttpException,
  BadRequestException,
  UseGuards,
  Request,
  Res,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { MoodTrackerService } from './mood-tracker.service';
import { LogMoodDto } from './dto/log-mood.dto';
import { MoodValue } from 'src/enums/mood.enum';

@ApiTags('Mood-Tracker')
@Controller('mood-tracker')
export class MoodTrackerController {
  private readonly logger = new Logger(MoodTrackerController.name);
  constructor(private readonly moodTrackerService: MoodTrackerService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log mood' })
  @ApiCreatedResponse({ description: 'Mood logged successfully' })
  @ApiOkResponse({ description: 'Mood logged successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async logMood(@Request() req: any, @Body() logMoodDto: LogMoodDto) {
    try {
      const userId = req.user.id;
      return this.moodTrackerService.logMood(logMoodDto, userId);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mood history' })
  @ApiOkResponse({ description: 'Mood history fetched successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiQuery({
    name: 'moodValue',
    required: false,
    type: String,
    description: 'Filter by mood value',
    example: 'happy',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
    example: '2022-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
    example: '2022-12-31',
  })
  async getMoodHistory(
    @Request() req: any,
    @Query('moodValue') moodValue?: MoodValue,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const userId = req.user.id;
      return this.moodTrackerService.getMoodHistory(userId, {
        moodValue,
        startDate,
        endDate,
      });
    } catch (error) {
      console.log('error', error);
      this.logger.error(error.message);
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          error.message || 'Failed to get mood history',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history/:moodId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mood history by id' })
  @ApiOkResponse({ description: 'Mood fetched successfully' })
  @ApiNotFoundResponse({ description: 'Mood not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({
    name: 'moodId',
    type: String,
    required: true,
    description: 'Mood ID',
  })
  async getMoodHistoryById(@Param('moodId') moodId: string) {
    try {
      return this.moodTrackerService.getMoodHistoryById(moodId);
    } catch (error) {
      console.log('error', error);
      this.logger.error(error.message);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download mood history' })
  @ApiOkResponse({ description: 'Mood history Downloaded successfully' })
  @ApiBadRequestResponse({ description: 'Invalid date format' })
  @ApiBadRequestResponse({ description: 'End date must be after start date.' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (YYYY-MM-DD)',
    example: '2022-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (YYYY-MM-DD)',
    example: '2022-12-31',
  })
  async downloadMood(
    @Request() req,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const userId = req.user.id;
      const fileBuffer = await this.moodTrackerService.downloadMoodHistory(
        userId,
        { startDate, endDate },
      );

      res.set({
        'Content-Disposition': 'attachment; filename="mood-history.csv"',
        'Content-Type': 'text/csv',
      });
      res.send(fileBuffer);
    } catch (error) {
      console.log('error', error);
      this.logger.error(error.message);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mood stats' })
  @ApiOkResponse({ description: 'Mood stats fetched succesfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async getMoodStats(@Request() req) {
    try {
      const userId = req.user.id;
      return this.moodTrackerService.getMoodStats(userId);
    } catch (error) {
      console.log('error', error);
      this.logger.error(error.message);
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
