import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Exclude } from 'class-transformer';

import { AbstractEntity } from 'src/shared/base-entity';

@Entity()
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  // @Column({ type: 'date' })
  // dob: Date;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;
}
