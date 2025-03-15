import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  meal_type: string; // Breakfast, Lunch, Dinner, Snack

  @Column({ type: 'int' })
  calories: number;

  @Column({ type: 'int' })
  protein: number;

  @Column({ type: 'int' })
  carbohydrates: number;

  @Column({ type: 'int' })
  fats: number;
}
