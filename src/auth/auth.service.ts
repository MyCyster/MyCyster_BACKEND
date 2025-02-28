import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { jwtConstant } from './constants';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    // private readonly jwtService: JwtService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      this.logger.error('Email already in use');
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashData(signUpDto.password);

    const userData = await this.userRepository.create({
      name: signUpDto.name,
      email: signUpDto.email,
      password: hashedPassword,
    });

    const user = await this.userRepository.save(userData);

    const email_verification_code = Math.floor(
      1000 + Math.random() * 9000,
    ).toString();

    await this.userRepository.update(user.id, {
      email_verification_code: email_verification_code,
    });

    await this.sendVerificationEmail(user, email_verification_code);

    const userDetails = await this.userRepository.findOne({
      where: { id: user.id },
    });

    this.logger.log(
      `User account created successfully and email verification code sent to ${user.email}`,
    );

    return {
      message: 'OTP sent successfully',
      user: userDetails,
    };
  }
  
  async hashData(data: string) {
    const salt = 10;
    const hashedData = bcrypt.hashSync(data, salt);
    return hashedData;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userRepository.findOne({
      where: [
        { email: verifyEmailDto.email },
        { email_verification_code: verifyEmailDto.email_verification_code },
      ],
    });

    if (
      !user ||
      user.email_verification_code !== verifyEmailDto.email_verification_code
    ) {
      this.logger.error('Invalid code');
      throw new BadRequestException('Invalid Code');
    }

    user.is_email_verified = true;

    await this.userRepository.update(user.id, { is_email_verified: true });

    this.logger.log('Email verified successfully');

    return { message: 'Your Email has been verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      this.logger.log('Invalid email or password');
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.error('Invalid email or password');
      throw new BadRequestException('Invalid email or password');
    }

    const token = await this.getToken(user.id, user.email);
    this.logger.log(`${user.email} logged in successfully`);
    return {
      ...user,
      password: undefined,
      refresh_token: undefined,
      email_verification_code: undefined,
      reset_password_token: undefined,
      reset_password_expiration: undefined,
      token,
    };
  }

  async forgotPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      throw new NotFoundException('User not Found');
    }

    const token = await this.generatePasswordResetToken();

    // Set expiration to 30 minutes from now
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30);

    await this.userRepository.update(user.id, {
      reset_password_token: token,
      reset_password_expiration: expirationTime,
    });

    await this.sendPasswordResetEmail(user, token);

    return {
      message: 'Password reset link sent to your email',
      reset_password_token: token,
      url: `${process.env.BASE_URL}/auth/reset-password/${token}`,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (!resetPasswordDto.password) {
      throw new BadRequestException('Please input your new password');
    }

    const user = await this.userRepository.findOne({
      where: { reset_password_token: resetPasswordDto.reset_password_token },
    });

    if (!user) {
      throw new NotFoundException('Invalid token');
    }

    if (user.reset_password_expiration) {
      const currentTime = new Date();
      const expirationTime = new Date(user.reset_password_expiration);

      if (currentTime > expirationTime) {
        throw new BadRequestException('Token has expired');
      }
    }

    const newPassword = await this.hashData(resetPasswordDto.password);

    await this.userRepository.update(user.id, {
      password: newPassword,
      reset_password_token: null,
      reset_password_expiration: null,
    });

    return {
      message: 'Password has been changed successfully',
      email: user.email,
    };
  }
  async getToken(userId: string, email: string) {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      // {
      //   secret: jwtConstant.secret,
      //   expiresIn: '2d',
      // },
    );
    return token;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = bcrypt.compare(password, hashedPassword);
    return isPasswordMatching;
  }
  async sendVerificationEmail(user, code) {
    const subject = 'Verification Code';

    const name = user.name;

    await this.emailService.sendEmail(user.email, subject, {
      templateName: 'email-verification',
      context: { name, code },
    });
  }

  async sendPasswordResetEmail(user, token) {
    const subject = 'Password Reset';
    const name = user.name;
    const url = `${process.env.BASEURL}/auth/reset-password/${token}`;

    await this.emailService.sendEmail(user.email, subject, {
      templateName: 'reset-password',
      context: { name, url },
    });
  }

  async generatePasswordResetToken() {
    const token = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    return token;
  }
}
