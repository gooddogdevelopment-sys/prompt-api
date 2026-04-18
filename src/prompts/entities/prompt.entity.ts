import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column('text')
  content: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  responseObject?: string;

  @Index()
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.prompts, {
    onDelete: 'CASCADE', // or 'SET NULL' / 'RESTRICT' depending on what you want
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
