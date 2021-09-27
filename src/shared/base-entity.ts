import {
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { User } from '../user/user.entity';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn()
  dateCreated?: Date;

  @UpdateDateColumn()
  dateUpdated?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  updatedBy: User;

  @Column({ nullable: true })
  updatedById: string;
}
