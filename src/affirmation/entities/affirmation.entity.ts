import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Affirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'affirmation', type: 'text' })
  affirmation: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
