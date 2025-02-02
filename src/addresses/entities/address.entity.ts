import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'city', type: 'text', nullable: false })
  city: string;

  @Column({ name: 'region', type: 'text', nullable: true })
  region?: string;

  @Column({ name: 'street', type: 'text', nullable: false })
  street: string;

  @Column({ name: 'building', type: 'text', nullable: false })
  building: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({
    name: 'lat',
    type: 'decimal',
    precision: 11,
    scale: 7,
    nullable: false,
  })
  lat: number;

  @Column({
    name: 'lon',
    type: 'decimal',
    precision: 11,
    scale: 7,
    nullable: false,
  })
  lon: number;

  @Column({ name: 'isDefault', default: false })
  isDefault: boolean;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

  @Column({ name: 'userId', nullable: false })
  userId: string;

  @ManyToOne((type) => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
