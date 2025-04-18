import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../user/entities/user.entity';
import { Food } from './food.entity';

@Entity('meal_plan')
export class MealPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.mealPlans)
  @JoinColumn({ name: 'user_id' }) // This matches the column name in the migration
  user: Users;

  @Column({ type: 'text'})
  meal_type: string; // Breakfast, Lunch, Dinner, Snack

  @Column({ type: 'int' })
  days_count: number;

  @Column({ type: 'int', nullable: true })
  calorie_goal: number;

  @Column({ type: 'int' })
  protein: number;

  @Column({ type: 'int' })
  carbohydrates: number;

  @Column({ type: 'int' })
  fats: number;

  @Column({ type: 'text', nullable: true })
  dietary_restrictions: string;

  @ManyToMany(() => Food)
  @JoinTable({
    name: 'meal_plan_foods',
    joinColumn: { name: 'meal_plan_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'food_id', referencedColumnName: 'id' },
  })
  selectedFoods: Food[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
