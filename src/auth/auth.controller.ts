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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Sign up' })
  @ApiCreatedResponse({ description: 'Account Created Successfuly' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() signUpDto: SignUpDto) {
    try {
      return this.authService.signup(signUpDto);
    } catch (error) {
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

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email with OTP' })
  @ApiOkResponse({ description: 'Email verified successfully'})
  @ApiBadRequestResponse({ description: 'Invalid code' })
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      return this.authService.verifyEmail(verifyEmailDto);
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof BadRequestException) {
        throw new HttpException(
          error.message || 'Failed to verify email',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }


  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiOkResponse({ description: 'User Logged in successfully'})
  @ApiBadRequestResponse({ description: 'Invalid email or password' })
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      console.log(error);
      this.logger.error(error.message);
      if (error instanceof BadRequestException) {
        throw new HttpException(
          error.message || 'Failed to verify email',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

}
