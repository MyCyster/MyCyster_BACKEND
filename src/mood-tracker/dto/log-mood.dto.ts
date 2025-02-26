import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { MoodValue } from 'src/enums/mood.enum';

export class LogMoodDto {
    @ApiProperty({ description: 'The mood value', example: 'happy' })
    @IsString()
    @IsNotEmpty()
    mood: MoodValue;

    @ApiProperty({ description: 'The description of the mood', example: 'I am happy', required: false })
    @IsString()
    @IsOptional()
    description: string
}