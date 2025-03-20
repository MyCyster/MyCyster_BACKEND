import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  HttpException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AffirmationService } from './affirmation.service';
import { CreateAffirmationDto } from './dto/affirmation.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('affirmation')
export class AffirmationController {
  private readonly logger = new Logger(AffirmationController.name);
  constructor(private readonly affirmationService: AffirmationService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Creat affirmations in batch' })
  @ApiOkResponse({ description: 'Affirmations created successfully' })
  @ApiCreatedResponse({ description: 'Affirmation created successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() payload: CreateAffirmationDto) {
    try {
      return await this.affirmationService.createAffirmations(payload);
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
}
