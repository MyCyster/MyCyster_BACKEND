import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiPropertyOptional({
    description: 'User email',
    example: 'Jane@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    description: 'The reset password token',
  })
  @IsString()
  @IsOptional()
  reset_password_token?: string;

  @ApiPropertyOptional({
    description: 'The new password',
  })
  @IsString()
  @IsOptional()
  password: string;
}
