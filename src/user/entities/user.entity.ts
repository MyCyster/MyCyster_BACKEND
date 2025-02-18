import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name?: string;

  @Column({ name: 'email' })
  email?: string;

  @Column({ name: 'password' })
  password?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @Column({ name: 'email_verification_code', nullable: true })
  email_verification_code?: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  is_email_verified?: boolean;

  @Column({ name: 'reset_password_token', nullable: true })
  reset_password_token?: string;

  @CreateDateColumn({ name: 'reset_password_expiration', nullable: true })
  reset_password_expiration: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
