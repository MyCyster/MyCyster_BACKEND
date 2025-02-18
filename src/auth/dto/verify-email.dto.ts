import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Email verification code ',
    example: '1234',
  })
  @IsNumberString()
  @IsNotEmpty()
  email_verification_code?: string;
}
