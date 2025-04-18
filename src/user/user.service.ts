import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-user.dto';
import { UpdateImageDto } from './dto/update-user-profile-picture.dto';
import { AffirmationService } from 'src/affirmation/affirmation.service';
import { MoodTrackerService } from 'src/mood-tracker/mood-tracker.service';
import { MealPlannerService } from 'src/meal-planner/meal-planner.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly affirmationService: AffirmationService,
    private readonly moodTrackerService: MoodTrackerService,
    private readonly mealPlannerService: MealPlannerService,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const affirmation =
      await this.affirmationService.getAffirmationForUser(userId);
    const mood =
      await this.moodTrackerService.getMostFrequentMoodPercentage(userId);
    const calories =
      await this.mealPlannerService.getAverageCalorieGoal(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      is_active: user.is_active,
      image_url: user.image_url,
      affirmation,
      mood,
      calories,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { email, currentPassword, newPassword } = updateProfileDto;

    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log('User found:', user); // Debugging

    // If email is being updated, check if it's already in use
    if (email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already in use');
      }

      // Update the user's email
      user.email = email;
      console.log('Email updated:', user.email); // Debugging
    }

    // If new password is being updated, ensure the current password is provided and correct
    if (newPassword) {
      if (!currentPassword) {
        throw new BadRequestException('Current password is required');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Hash new password and update it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      console.log('Password updated'); // Debugging
    }

    // Save updated user
    await this.userRepository.save(user);
    console.log('User saved:', user); // Debugging

    return { message: 'Profile updated successfully' };
  }

  async editProfilePicture(userId: string, updateImageDto: UpdateImageDto) {
    const { image_url } = updateImageDto;

    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });

    console.log('User found:', user); // Debugging

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's profile picture
    await this.userRepository.update({ id: userId }, { image_url: image_url });
    console.log('Profile picture updated:', image_url); // Debugging

    return { message: 'Profile picture updated successfully' };
  }
  findUserForJwt(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }
}
