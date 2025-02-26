import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/user/entities/user.entity';
import { MoodValue } from 'src/enums/mood.enum';

@Entity()
export class Mood {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mood', type: 'enum', enum: MoodValue })
  mood: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
