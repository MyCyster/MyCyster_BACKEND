import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAffirmationDto {
  @ApiProperty({
    description: 'Affirmations',
    example: ['I am a good person', 'I am a good person'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  affirmations: string[];
}
