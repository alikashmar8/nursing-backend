import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

@Entity('reservation-types')
export class ReservationType extends BaseEntity {
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'isActive', default: true })
  isActive: boolean;

  @Column({ name: 'isMultipleShifts', nullable: false })
  isMultipleShifts: boolean;
}
