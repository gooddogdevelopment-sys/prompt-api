import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Prompt } from './prompt.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  providerUserId: string; //This id is to store the third party auth user id.

  @Column('text')
  email: string;

  @OneToMany(() => Prompt, (prompt) => prompt.user)
  prompts: Prompt[];
}
