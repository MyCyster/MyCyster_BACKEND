import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  HttpException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MoodTrackerService } from 'src/mood-tracker/mood-tracker.service';
import { AffirmationService } from 'src/affirmation/affirmation.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
